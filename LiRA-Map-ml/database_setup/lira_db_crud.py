from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from lira_db_model import Base, Measurements
import sqlalchemy.orm as orm
from typing import List, Tuple


def get_measurements(session: orm.Session) -> List[Measurements]:

    print("We are querying all measurements")
    return (
        session.query(Measurements)
        .where(Measurements.T == "acc.xyz")
        .limit(5).all()
        )