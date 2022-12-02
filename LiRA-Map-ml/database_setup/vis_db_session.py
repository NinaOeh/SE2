#Author: Nina Oehlckers (s213535)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings
from sqlalchemy.ext.declarative import declarative_base

VIS_DATABASE_URL = settings.DB_VIS_URL
print(f"Vis Database: {VIS_DATABASE_URL}")
vis_engine = create_engine(VIS_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=vis_engine)
Base = declarative_base()
def get_db():   
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()