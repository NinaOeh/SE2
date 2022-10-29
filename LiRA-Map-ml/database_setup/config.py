import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../../environment.env')
load_dotenv(dotenv_path=dotenv_path)


class Settings:
    PROJECT_NAME = "LiRA Map"
    PROJECT_VERSION = "1.0.0"

    LIRA_DB_USER = os.getenv("LIRA_DB_USER")
    LIRA_DB_PASSWORD = os.getenv("LIRA_DB_PASSWORD")
    LIRA_DB_SERVER = os.getenv("LIRA_DB_SERVER","localhost")
    LIRA_DB_PORT = os.getenv("LIRA_DB_PORT",5435) # default postgres port is 5432
    LIRA_DB_DATABASE = os.getenv("LIRA_DB_DATABASE","tdd")
    LIRA_DB_URL = DB_FRICTION_URL = f"postgresql://{LIRA_DB_USER}:{LIRA_DB_PASSWORD}@{LIRA_DB_SERVER}:{LIRA_DB_PORT}/{LIRA_DB_DATABASE}"


    DB_FRICTION_SERVER = os.getenv("DB_FRICTION_HOST","localhost")
    DB_FRICTION_PORT = os.getenv("DB_FRICTION_PORT",5432)
    DB_FRICTION_USER = os.getenv("DB_FRICTION_USERNAME")
    DB_FRICTION_PASSWORD = os.getenv("DB_FRICTION_PASSWORD")
    DB_FRICTION_DATABASE = os.getenv("LIRA_DB_DATABASE","tdd")
    DB_FRICTION_SSH_HOST = os.getenv("DB_FRICTION_SSH_HOST")
    DB_FRICTION_SSH_USER = os.getenv("DB_FRICTION_SSH_USER")
    DB_FRICTION_SSH_PASSWORD = os.getenv("DB_FRICTION_SSH_PASSWORD")

    DB_FRICTION_URL = f"postgresql://{DB_FRICTION_USER}:{DB_FRICTION_PASSWORD}@{DB_FRICTION_SERVER}:{DB_FRICTION_PORT}/{DB_FRICTION_DATABASE}"

settings = Settings()
print(os.getenv("LIRA_DB_USER"))