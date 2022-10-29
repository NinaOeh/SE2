from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import settings
from sqlalchemy.ext.declarative import declarative_base

LIRA_DATABASE_URL = settings.LIRA_DB_URL
print(LIRA_DATABASE_URL)
lira_engine = create_engine(LIRA_DATABASE_URL)

#DB_FRICTION_URL = settings.DB_FRICTION_URL
#friction_engine = create_engine(DB_FRICTION_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=lira_engine)
Base = declarative_base()
def get_db():   #new
    print("I am here")
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()