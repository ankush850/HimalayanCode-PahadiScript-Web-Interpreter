import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("PAHADI_SECRET_KEY", "dev-pahadi-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "PAHADI_DATABASE_URL",
        "sqlite:///" + os.path.join(os.path.dirname(os.path.dirname(__file__)), "instance", "pahadiscript.db"),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = os.environ.get("FLASK_ENV") == "production"

class ProductionConfig(Config):
    SECRET_KEY = os.environ.get("PAHADI_SECRET_KEY")
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("PAHADI_DATABASE_URL")

class DevelopmentConfig(Config):
    DEBUG = True
