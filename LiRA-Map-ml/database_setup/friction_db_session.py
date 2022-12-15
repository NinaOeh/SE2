# created by Nina Oehlckers (s213535)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy.orm as orm

from config import settings
from sqlalchemy.ext.declarative import declarative_base

FRICTION_DATABASE_URL = settings.DB_FRICTION_URL
print(f"Friction Database:{FRICTION_DATABASE_URL}")
friction_engine = create_engine(FRICTION_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=friction_engine)
Base = declarative_base()

# function to generate friction db sessions
def get_db() -> orm.Session:
    try:
        db = SessionLocal()
        return db
    finally:
        db.close()