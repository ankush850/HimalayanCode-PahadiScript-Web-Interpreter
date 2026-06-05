import os
from flask import Blueprint, redirect, current_app

bp = Blueprint("main", __name__)


@bp.route("/", defaults={"path": ""})
@bp.route("/<path:path>")
def catch_all(path: str):
    """Redirect all non-API routes to the React dev server in dev, serve React SPA in production."""
    # Ensure we don't accidentally redirect API requests
    if path.startswith("api"):
        return {"ok": False, "error": "Not found"}, 404

    env = (os.environ.get("FLASK_ENV") or "").lower()
    if env == "production":
        return current_app.send_static_file("index.html")

    return redirect(f"http://localhost:5173/{path}")
