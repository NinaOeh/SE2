#Author: Nina Oehlckers (s213535)
from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import HTMLResponse
from lira_db_model import Base, Measurements, MapReferences
import sqlalchemy.orm as orm
from typing import List, Tuple


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

    return (session.query(MapReferences)
        .join(MapReferences.FK_Measurement)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.MeasurementId).limit(100000).all()
        )

def get_rl(session: orm.Session) -> List[Measurements]:

    return(session.query(Measurements)
        .join(MapReferences, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.MeasurementId).limit(100000).all()
        )

def get_fl_ref(session: orm.Session) -> List[MapReferences]:

    return (session.query(MapReferences)
        .outerjoin(Measurements, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_fl")
        .order_by(MapReferences.FK_MeasurementId).limit(100000).all()
        )

def get_fl(session: orm.Session) -> List[Measurements]:
    
    return(session.query(Measurements)
        .outerjoin(MapReferences, Measurements.MeasurementId == MapReferences.FK_MeasurementId)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_fl")
        .order_by(Measurements.MeasurementId).limit(100000).all() #the ordering and limit should be removed when querying all data!!
        )
