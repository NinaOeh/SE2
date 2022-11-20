#Author: Nina Oehlckers (s213535)
from lira_db_model import Base, Measurements, MapReferences
import sqlalchemy.orm as orm
from typing import List, Tuple
import datetime
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

def get_rl_mapref(session: orm.Session, 
                  offset: int,
                  limit: int,
                  trip_id: str) -> List[Tuple[MapReferences, Measurements]]:
    return (session.query(MapReferences, Measurements)
        .join(Measurements, Measurements.MeasurementId == MapReferences.FK_MeasurementId, isouter=True)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.T == "obd.rpm_rl",
            Measurements.FK_Trip == trip_id,)
        .order_by(Measurements.TS_or_Distance)
        .limit(limit).offset(offset).all()
        )

def get_fl(session: orm.Session, latest_time: datetime.datetime, 
           earliest_time: datetime.datetime, trip_id: str) -> List[Measurements]:
    return(session.query(Measurements)
        .where(
            Measurements.T == "obd.rpm_fl",
            Measurements.FK_Trip == trip_id,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.TS_or_Distance <= latest_time,
            Measurements.TS_or_Distance >= earliest_time)
        .order_by(Measurements.TS_or_Distance)
        .all()
        )

def get_rl_2(session: orm.Session) -> List[Measurements]:
    trip_id = '3decdffe-5c6e-4f3c-a4ea-868ca34a3d22'
    return(
        session.query(Measurements)
        .where(
            Measurements.FK_Trip == trip_id,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_rl")
        .order_by(Measurements.TS_or_Distance)
        .limit(5000).offset(15000).all()
        )

def get_fl_2(session: orm.Session) -> List[Measurements]:
    trip_id = '3decdffe-5c6e-4f3c-a4ea-868ca34a3d22'
    return(session.query(Measurements)
        .where(
            Measurements.FK_Trip == trip_id,
            Measurements.lat != None,
            Measurements.lon != None,
            Measurements.message != None,
            Measurements.T == "obd.rpm_fl")
        .order_by(Measurements.TS_or_Distance)
        .limit(5000).offset(15000).all()
        )
