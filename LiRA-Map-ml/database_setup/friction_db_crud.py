#Author: Nina Oehlckers (s213535)
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from friction_db_model import Friction, RPM_fl, RPM_rl
import sqlalchemy.orm as orm
from typing import List, Tuple
import datetime

def insert_friction_data(
    session: orm.Session,
    timestamp: datetime.datetime,
    rpm_fl: float,
    rpm_rl: float,
    friction_value: float,
    lat: float,
    lon: float
) -> None:
    friction_row = Friction(
        friction_value=friction_value,
        lat=lat,
        lon=lon,
        rpm_fl_value=rpm_fl,
        rpm_rl_value=rpm_rl,
        TS_or_Distance=timestamp
        )
    session.add(friction_row)


def insert_rpm_rl_data(
    session: orm.Session,
    MId: int,
    T: str,
    lat: float,
    lon: float,
    value: float,
) -> None:
    rl_row = RPM_rl(
        MeasurementId=MId,
        T=T,
        lat=lat,
        lon=lon,
        rpm_rl_value=value,
        )
    session.add(rl_row)




