#Author: Nina Oehlckers (s213535)
<<<<<<< HEAD
=======
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
from lira_db_model import Base, Measurements, MapReferences
import sqlalchemy.orm as orm
from typing import List, Tuple
import uuid
import sqlalchemy
from sqlalchemy import cast


def get_measurements(session: orm.Session) -> List[Measurements]:

    return (
        session.query(Measurements)
        .where(Measurements.T == "obd.rpm_fl")
        .where(Measurements.lat != None)
        .where(Measurements.lon != None)
        .limit(5).all()
        )

# obd.rpm_rl
# obd.rpm_fl

def get_rl_ref(session: orm.Session) -> List[MapReferences]:
<<<<<<< HEAD
    trip_id = '4f4b5de3-07b4-440e-b66e-b67069538b9e'
=======

>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
    return (session.query(MapReferences)
        .join(MapReferences.FK_Measurement)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
<<<<<<< HEAD
            Measurements.T == "obd.rpm_rl",
            Measurements.FK_Trip == trip_id,)
        .order_by(Measurements.MeasurementId).limit(100).all()
        )

def get_rl_1(session: orm.Session) -> List[Measurements]:
    trip_id = '4f4b5de3-07b4-440e-b66e-b67069538b9e'
=======
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.MeasurementId).limit(100000).all()
        )

def get_rl(session: orm.Session) -> List[Measurements]:

>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
    return(session.query(Measurements)
        .join(MapReferences, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
<<<<<<< HEAD
            Measurements.T == "obd.rpm_rl",
            Measurements.FK_Trip == trip_id,)
        .order_by(Measurements.MeasurementId).limit(100).all()
        )

def get_fl_1(session: orm.Session) -> List[Measurements]:
    trip_id = '4f4b5de3-07b4-440e-b66e-b67069538b9e'
    subquery = (session.query(Measurements.TS_or_Distance)
        .join(MapReferences, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
=======
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.MeasurementId).limit(100000).all()
        )

def get_fl_ref(session: orm.Session) -> List[MapReferences]:

    return (session.query(MapReferences)
        .outerjoin(Measurements, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
<<<<<<< HEAD
            Measurements.T == "obd.rpm_rl",
            Measurements.FK_Trip == trip_id,)
        .order_by(Measurements.MeasurementId).limit(100).subquery())
    return(session.query(Measurements)
        .where(Measurements.T == "obd.rpm_rr")
        .filter(Measurements.TS_or_Distance.in_(subquery)).all()
        )

def get_rl_2(session: orm.Session) -> List[Measurements]:
    trip_id = '4f4b5de3-07b4-440e-b66e-b67069538b9e'
    return(
        session.query(Measurements)
        .where(
            Measurements.FK_Trip == trip_id,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.TS_or_Distance)
        .limit(5000).all()
        )

def get_fl_2(session: orm.Session) -> List[Measurements]:
    trip_id = '4f4b5de3-07b4-440e-b66e-b67069538b9e'
    return(session.query(Measurements)
        .where(
            Measurements.FK_Trip == trip_id,
=======
            Measurements.T == "obd.rpm_fl")
        .order_by(MapReferences.FK_MeasurementId).limit(100000).all()
        )

def get_fl(session: orm.Session) -> List[Measurements]:
    
    return(session.query(Measurements)
        .outerjoin(MapReferences, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_fl")
<<<<<<< HEAD
        .order_by(Measurements.TS_or_Distance)
        .limit(5000).all()
=======
        .order_by(Measurements.MeasurementId).limit(100000).all() #the ordering and limit should be removed when querying all data!!
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
        )
