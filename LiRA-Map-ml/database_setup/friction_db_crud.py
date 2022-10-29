#Author: Nina Oehlckers (s213535)
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from friction_db_model import Friction
import sqlalchemy.orm as orm
from typing import List, Tuple

def insert_friction_data(
    session: orm.Session,
    MId: int,
    T: str,
    value: float,
    message: str
) -> None:
    friction_row = Friction(
        MeasurementId=MId,
        T=T,
        friction_value=value,
        message=message
        )
    session.add(friction_row)
