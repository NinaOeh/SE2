# created by Nina Oehlckers (s213535)

from lira_db_model import Measurements, MapReferences
import sqlalchemy.orm as orm
from typing import List, Tuple
import datetime

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

def get_map_ref_red(session: orm.Session,
                offset: int,
                limit: int) -> List[MapReferences]:
    return (session.query(MapReferences.PossibleMatchingRoutes, MapReferences.direction, MapReferences.lane)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            MapReferences.PossibleMatchingRoutes != None)
        .order_by(MapReferences.MapReferenceId).limit(limit).offset(offset).all()
        )

def get_map_ref_red_pertrip(session: orm.Session,
                trip_id: str,
                offset: int,
                limit: int) -> List[MapReferences]:
    return (session.query(MapReferences.PossibleMatchingRoutes, MapReferences.direction, MapReferences.lane)
        .join(Measurements, Measurements.MeasurementId == MapReferences.FK_MeasurementId, isouter=True)
        .where(MapReferences.lat_MapMatched != None,
            MapReferences.lon_MapMatched != None,
            MapReferences.PossibleMatchingRoutes != None,
            Measurements.FK_Trip == trip_id,)
        .order_by(MapReferences.MapReferenceId).limit(limit).offset(offset).all()
        )

          

    