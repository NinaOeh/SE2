#Author: Nina Oehlckers (s213535)
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('../../environment.env')
print(dotenv_path)
load_dotenv(dotenv_path=dotenv_path)


class Settings:
    PROJECT_NAME = "LiRA Map"
    PROJECT_VERSION = "1.0.0"

    LIRA_DB_USER = os.getenv("LIRA_DB_USER")
    LIRA_DB_PASSWORD = os.getenv("LIRA_DB_PASSWORD")
    LIRA_DB_SERVER = os.getenv("LIRA_DB_SERVER","se2_A.compute.dtu.dk")
    LIRA_DB_PORT = os.getenv("LIRA_DB_PORT",5432) # default postgres port is 5432
    LIRA_DB_DATABASE = os.getenv("LIRA_DB_DATABASE","tdd")
    LIRA_DB_URL = f"postgresql://{LIRA_DB_USER}:{LIRA_DB_PASSWORD}@{LIRA_DB_SERVER}:{LIRA_DB_PORT}/{LIRA_DB_DATABASE}"


    DB_FRICTION_SERVER = os.getenv("DB_FRICTION_HOST","localhost")
    DB_FRICTION_PORT = os.getenv("DB_FRICTION_PORT",5432)
    DB_FRICTION_USER = os.getenv("DB_FRICTION_USER")
    DB_FRICTION_PASSWORD = os.getenv("DB_FRICTION_PASSWORD")
    DB_FRICTION_DATABASE = os.getenv("LIRA_DB_DATABASE","tdd")
    DB_FRICTION_URL = f"postgresql://{DB_FRICTION_USER}:{DB_FRICTION_PASSWORD}@{DB_FRICTION_SERVER}:{DB_FRICTION_PORT}/{DB_FRICTION_DATABASE}"

    DB_VIS_SERVER = os.getenv("DB_VIS_HOST","liradb.postgres.database.azure.com")
    DB_VIS_PORT = os.getenv("DB_VIS_PORT",5432)
    DB_VIS_USER = os.getenv("DB_VIS_USER", 'read_user')
    DB_VIS_PASSWORD = os.getenv("DB_VIS_PASSWORD", 'read_pwd')
    DB_VIS_DATABASE = os.getenv("DB_VIS_DATABASE","postgis")
    DB_VIS_URL = f"postgresql://{DB_VIS_USER}:{DB_VIS_PASSWORD}@{DB_VIS_SERVER}:{DB_VIS_PORT}/{DB_VIS_DATABASE}"


settings = Settings()
print(os.getenv("LIRA_DB_USER"))