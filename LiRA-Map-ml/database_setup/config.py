#created by Nina Oehlckers (s213535)

import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path('./.env')
load_dotenv(dotenv_path=dotenv_path)


class Settings:
    PROJECT_NAME = "LiRA Map"
    PROJECT_VERSION = "1.0.0"

    LIRA_DB_USER = os.getenv("DB_USER_LIRA")
    LIRA_DB_PASSWORD = os.getenv("DB_PWD_LIRA")
    LIRA_DB_SERVER = os.getenv("DB_SERVER_LIRA","se2_A.compute.dtu.dk")
    LIRA_DB_PORT = os.getenv("DB_PORT_LIRA",5432) # default postgres port is 5432
    LIRA_DB_DATABASE = os.getenv("DB_DATABASE_LIRA","tdd")
    LIRA_DB_URL = f"postgresql://{LIRA_DB_USER}:{LIRA_DB_PASSWORD}@{LIRA_DB_SERVER}:{LIRA_DB_PORT}/{LIRA_DB_DATABASE}"


    DB_FRICTION_SERVER = os.getenv("DB_SERVER_FRICTION","localhost")
    DB_FRICTION_PORT = os.getenv("DB_PORT_FRICTION",5432)
    DB_FRICTION_USER = os.getenv("DB_USER_FRICTION")
    DB_FRICTION_PASSWORD = os.getenv("DB_PWD_FRICTION")
    DB_FRICTION_DATABASE = os.getenv("DB_DATABASE_FRICTION","tdd")
    DB_FRICTION_URL = f"postgresql://{DB_FRICTION_USER}:{DB_FRICTION_PASSWORD}@{DB_FRICTION_SERVER}:{DB_FRICTION_PORT}/{DB_FRICTION_DATABASE}"

    DB_VIS_SERVER = os.getenv("DB_SERVER_POSTGIS","liradb.postgres.database.azure.com")
    DB_VIS_PORT = os.getenv("DB_PORT_POSTGIS",5432)
    DB_VIS_USER = os.getenv("DB_USER_POSTGIS")
    DB_VIS_PASSWORD = os.getenv("DB_PWD_POSTGIS")
    DB_VIS_DATABASE = os.getenv("DB_DATABASE_POSTGIS","postgis")
    DB_VIS_URL = f"postgresql://{DB_VIS_USER}:{DB_VIS_PASSWORD}@{DB_VIS_SERVER}:{DB_VIS_PORT}/{DB_VIS_DATABASE}"


settings = Settings()