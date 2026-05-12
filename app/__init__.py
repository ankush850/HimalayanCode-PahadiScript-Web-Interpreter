from __future__ import annotations

import os

from flask import Flask

from app.config import Config, DevelopmentConfig, ProductionConfig
from app.extensions import db, limiter, migrate


def create_app(config_object: type[Config] | None = None) -> Flask:
    """Create and configure the Flask application instance."""

    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)

    if config_object is None:
        env = (os.environ.get("FLASK_ENV") or "").lower()
        if env == "production":
            config_object = ProductionConfig
        elif env == "development":
            config_object = DevelopmentConfig
        else:
            config_object = Config

    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)

    # Existing route code expects a SQLAlchemy session on the app object.
    app.db_session = db.session

    from app import models  # noqa: F401
    from app.routes.api import bp as api_bp
    from app.routes.main import bp as main_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app


__all__ = ["create_app"]
