#Author: Nina Oehlckers (s213535)
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from friction_db_model import Friction
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
    lon: float,
    FK_Trip: str,
    WayPoint_index: str,
    wayPoint_Name: str,
    legDistance_MapMatched: float,
    Way_id: str,
    Node_id: str,
    lane: int,
    direction: str,
    MeasurementId_rl: str
) -> None:
    friction_row = Friction(
        friction_value=friction_value,
        mapped_lat=lat,
        mapped_lon=lon,
        rpm_fl_value=rpm_fl,
        rpm_rl_value=rpm_rl,
        TS_or_Distance=timestamp,
        FK_Trip=FK_Trip,
        MeasurementId_rl=MeasurementId_rl,
        Node_id=Node_id,
        WayPoint_index=WayPoint_index,
        wayPoint_Name=wayPoint_Name,
        legDistance_MapMatched=legDistance_MapMatched,
        Way_id=Way_id,
        lane=lane,
        direction=direction
        )
    session.add(friction_row)


def get_friction_data(session: orm.Session, 
                  offset: int,
                  limit: int) -> List[Friction]:
    return (session.query(Friction)
        .order_by(Friction.TS_or_Distance)
        .limit(limit).offset(offset).all()
        ) #.where(Friction.TS_or_Distance >= lookback,


