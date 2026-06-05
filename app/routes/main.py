from flask import Blueprint, redirect

bp = Blueprint("main", __name__)


@bp.route("/", defaults={"path": ""})
@bp.route("/<path:path>")
def catch_all(path: str):
    """Redirect all non-API routes to the React development server."""
    # Ensure we don't accidentally redirect API requests
    if path.startswith("api"):
        return {"ok": False, "error": "Not found"}, 404
    return redirect(f"http://localhost:5173/{path}")
