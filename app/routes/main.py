from flask import Blueprint, redirect, render_template, session, url_for

bp = Blueprint("main", __name__)


def _is_authenticated() -> bool:
    return "user_id" in session


@bp.route("/")
def root():
    if _is_authenticated():
        return redirect(url_for("main.editor_page"))
    return redirect(url_for("main.login_page"))


@bp.route("/editor")
def editor_page():
    if not _is_authenticated():
        return redirect(url_for("main.login_page"))
    return render_template("index.html")


@bp.route("/login")
def login_page():
    if _is_authenticated():
        return redirect(url_for("main.editor_page"))
    return render_template("login.html")


@bp.route("/register")
def register_page():
    if _is_authenticated():
        return redirect(url_for("main.editor_page"))
    return render_template("register.html")


@bp.route("/dashboard")
def dashboard_page():
    if not _is_authenticated():
        return redirect(url_for("main.login_page"))
    return render_template("dashboard.html")


@bp.route("/share/<share_id>")
def share_page(share_id: str):
    return render_template("share.html", share_id=share_id)
