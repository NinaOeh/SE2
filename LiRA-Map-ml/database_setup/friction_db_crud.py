#Author: Nina Oehlckers (s213535)
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from friction_db_model import Friction, Geometry, Friction_Test
import sqlalchemy.orm as orm
from typing import List, Tuple
import datetime
import shapely.geometry
from sqlalchemy import update


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
    MeasurementId_rl: str,
    geometry: shapely.geometry.LineString
) -> None:
    friction_row = Friction_Test(
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
        direction=direction,
        geometry=geometry
        )
    session.add(friction_row)

def insert_only_friction_data(
    session: orm.Session,
    timestamp: datetime.datetime,
    rpm_fl: float,
    rpm_rl: float,
    friction_value: float,
    lat: float,
    lon: float,
    FK_Trip: str,
    legDistance_MapMatched: float,
    Way_id: str,
    Node_id: str,
    MeasurementId_rl: str,
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
        legDistance_MapMatched=legDistance_MapMatched,
        Way_id=Way_id
        )
    session.add(friction_row)


def insert_geometry_data(
    session: orm.Session,
    wayPoint_Name: str,
    Way_id: str,
    lane: int,
    direction: str,
    geometry: shapely.geometry.LineString,
    date: datetime.datetime
) -> None:
    geo_row = Geometry(
        wayPoint_Name=wayPoint_Name,
        Way_id=Way_id,
        lane=lane,
        direction=direction,
        geometry=geometry,
        dateUploaded=date
        )
    session.add(geo_row)

def update_wayPoint_Name(session: orm.Session,
                         name: str,
                         Way_id: str):
    
    session.query(Geometry).\
                    where(Geometry.Way_id == Way_id).\
                    update({'wayPoint_Name':name})
    session.commit()

def update_wayid(session: orm.Session,
                 FrictionId: int,
                 Way_id: str):
    
    session.query(Friction).\
                    where(Friction.FrictionId == FrictionId).\
                    update({'Way_id':Way_id})
    session.commit()


def get_friction_data(session: orm.Session, 
                      trip_id: int) -> List[Friction]:
    return (session.query(Friction)
        .where(Friction.FK_Trip == trip_id)
        .all()
        ) #.where(Friction.TS_or_Distance >= lookback,

def get_geometry_data(session: orm.Session) -> List[Geometry]:
    return (session.query(Geometry).offset(50).limit(150).all()
        ) #.where(Friction.TS_or_Distance >= lookback,

