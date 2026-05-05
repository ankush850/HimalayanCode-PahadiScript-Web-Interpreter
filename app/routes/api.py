import time
import uuid
from functools import wraps

from flask import Blueprint, jsonify, request, session
from sqlalchemy import case, func
from sqlalchemy.orm import Session
from werkzeug.security import check_password_hash, generate_password_hash

from app.compiler import execute
from app.models import ExecutionHistory, SharedCode, User
from app.extensions import limiter

bp = Blueprint("api", __name__)


def _db() -> Session:
    from flask import current_app

    return current_app.db_session


def login_required(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({"ok": False, "error": "Authentication required"}), 401
        return f(*args, **kwargs)

    return wrapped


@bp.route("/register", methods=["POST"])
@limiter.limit("5 per minute")
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    if not username or len(username) < 2:
        return jsonify({"ok": False, "error": "Username must be at least 2 characters"}), 400
    if len(password) < 6:
        return jsonify({"ok": False, "error": "Password must be at least 6 characters"}), 400
    db = _db()
    if db.query(User).filter_by(username=username).first():
        return jsonify({"ok": False, "error": "Username already taken"}), 409
    user = User(username=username, password_hash=generate_password_hash(password))
    db.add(user)
    db.commit()
    session["user_id"] = user.id
    session["username"] = user.username
    return jsonify({"ok": True, "user": {"id": user.id, "username": user.username}})


@bp.route("/login", methods=["POST"])
@limiter.limit("5 per minute")
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    db = _db()
    user = db.query(User).filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"ok": False, "error": "Invalid username or password"}), 401
    session["user_id"] = user.id
    session["username"] = user.username
    return jsonify({"ok": True, "user": {"id": user.id, "username": user.username}})


@bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"ok": True})


@bp.route("/me", methods=["GET"])
def me():
    if "user_id" not in session:
        return jsonify({"ok": True, "authenticated": False})
    return jsonify(
        {
            "ok": True,
            "authenticated": True,
            "user": {"id": session["user_id"], "username": session.get("username")},
        }
    )


@bp.route("/execute", methods=["POST"])
@limiter.limit("20 per minute")
def run_code():
    data = request.get_json(silent=True) or {}
    code = data.get("code")
    if code is None or not isinstance(code, str):
        return jsonify({"ok": False, "error": "Missing or invalid 'code' field"}), 400
    if len(code) > 50_000:
        return jsonify({"ok": False, "error": "Code exceeds maximum length"}), 400

    stdin_text = data.get("stdin")
    if stdin_text is not None and not isinstance(stdin_text, str):
        return jsonify({"ok": False, "error": "Field 'stdin' must be a string"}), 400

    t0 = time.perf_counter()
    success, out, err = execute(code, stdin_text=stdin_text if isinstance(stdin_text, str) else None)
    elapsed_ms = (time.perf_counter() - t0) * 1000.0

    user_id = session.get("user_id")
    if user_id:
        db = _db()
        row = ExecutionHistory(
            user_id=user_id,
            code=code,
            success=success,
            execution_time_ms=elapsed_ms,
            output=out if success else (out or None),
            error_message=err if not success else None,
        )
        db.add(row)
        db.commit()

    return jsonify(
        {
            "ok": success,
            "output": out,
            "error": err,
            "execution_time_ms": round(elapsed_ms, 3),
        }
    )


@bp.route("/history", methods=["GET"])
@login_required
def history():
    db = _db()
    rows = (
        db.query(ExecutionHistory)
        .filter_by(user_id=session["user_id"])
        .order_by(ExecutionHistory.created_at.desc())
        .limit(200)
        .all()
    )
    return jsonify(
        {
            "ok": True,
            "items": [
                {
                    "id": r.id,
                    "code": r.code,
                    "success": r.success,
                    "execution_time_ms": r.execution_time_ms,
                    "output": r.output,
                    "error": r.error_message,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in rows
            ],
        }
    )


@bp.route("/analytics", methods=["GET"])
@login_required
def analytics():
    db = _db()
    uid = session["user_id"]
    total = db.query(func.count(ExecutionHistory.id)).filter_by(user_id=uid).scalar() or 0
    successes = (
        db.query(func.count(ExecutionHistory.id)).filter_by(user_id=uid, success=True).scalar() or 0
    )
    failures = total - successes
    avg_ms = db.query(func.avg(ExecutionHistory.execution_time_ms)).filter_by(user_id=uid).scalar() or 0.0

    # Fetch the last 100 runs to group by time (minute) instead of just by day
    recent_runs = (
        db.query(ExecutionHistory)
        .filter_by(user_id=uid)
        .order_by(ExecutionHistory.created_at.desc())
        .limit(100)
        .all()
    )

    daily_out = []
    # Process in chronological order (oldest to newest)
    for r in reversed(recent_runs):
        if not r.created_at:
            continue
        # Group by hour and minute
        time_key = r.created_at.strftime("%H:%M")
        
        # Check if we already have an entry for this minute
        if not daily_out or daily_out[-1]["date"] != time_key:
            daily_out.append({
                "date": time_key,
                "success": 0,
                "failure": 0,
                "avg_execution_ms": 0.0,
                "_total_ms": 0.0,
                "_count": 0
            })
            
        entry = daily_out[-1]
        if r.success:
            entry["success"] += 1
        else:
            entry["failure"] += 1
            
        entry["_total_ms"] += r.execution_time_ms
        entry["_count"] += 1
        entry["avg_execution_ms"] = round(entry["_total_ms"] / entry["_count"], 2)

    # Clean up temp keys and limit to last 20 time points for the chart
    for entry in daily_out:
        entry["total_execution_ms"] = round(entry["_total_ms"], 2)
        entry.pop("_total_ms", None)
        entry.pop("_count", None)
        
    daily_out = daily_out[-20:]

    return jsonify(
        {
            "ok": True,
            "summary": {
                "total_runs": int(total),
                "successes": int(successes),
                "failures": int(failures),
                "success_rate": (successes / total) if total else 0.0,
                "avg_execution_ms": float(avg_ms),
            },
            "daily": daily_out,
        }
    )


@bp.route("/share", methods=["POST"])
@limiter.limit("10 per minute")
def create_share():
    data = request.get_json(silent=True) or {}
    code = data.get("code")
    if code is None or not isinstance(code, str):
        return jsonify({"ok": False, "error": "Missing or invalid 'code' field"}), 400
    if len(code) > 50_000:
        return jsonify({"ok": False, "error": "Code exceeds maximum length"}), 400
    sid = str(uuid.uuid4())
    db = _db()
    row = SharedCode(id=sid, code=code, user_id=session.get("user_id"))
    db.add(row)
    db.commit()
    return jsonify({"ok": True, "share_id": sid, "url": f"/share/{sid}"})


@bp.route("/share/<share_id>", methods=["GET"])
def get_share(share_id: str):
    db = _db()
    row = db.query(SharedCode).filter_by(id=share_id).first()
    if not row:
        return jsonify({"ok": False, "error": "Shared snippet not found"}), 404
    return jsonify({"ok": True, "code": row.code})
