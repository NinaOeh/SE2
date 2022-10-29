#Author: Nina Oehlckers (s213535)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sqlalchemy as sqla
import sqlalchemy.orm as orm

from config import settings
from sqlalchemy.ext.declarative import declarative_base
from typing import Generator

FRICTION_DATABASE_URL = settings.DB_FRICTION_URL
print(FRICTION_DATABASE_URL)
friction_engine = create_engine(FRICTION_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=friction_engine)
Base = declarative_base()

def create_session(engine: sqla.engine.Engine) -> orm.Session:
    session = orm.Session(engine)
    try:
        return session
    finally:
        session.close()