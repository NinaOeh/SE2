#Author: Nina Oehlckers (s213535)
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from config import settings
from apis.general_pages.route_homepage import general_pages_router
import lira_db_model
import lira_db_session
import lira_db_schema
import lira_db_crud
import lira_api

def include_router(app):
	app.include_router(general_pages_router)


lira_db_model.Base.metadata.create_all(bind=lira_db_session.engine)
app = FastAPI(title=settings.PROJECT_NAME,version=settings.PROJECT_VERSION)
app.include_router(lira_api.router)
