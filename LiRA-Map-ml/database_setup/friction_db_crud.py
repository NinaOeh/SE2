# created by Nina Oehlckers (s213535)

from friction_db_model import Friction, Geometry
import sqlalchemy.orm as orm
from typing import List
import datetime
import shapely.geometry


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
    # Insert friction data into Friction table of Friction DB
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
    # Insert geometry data into Geometry table of Friction DB
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
    # Update wayPoint_Name of the Geometry table of Friction DB
    session.query(Geometry).\
                    where(Geometry.Way_id == Way_id).\
                    update({'wayPoint_Name':name})
    session.commit()

def update_wayid(session: orm.Session,
                 FrictionId: int,
                 Way_id: str):
    # Update WayId of the Friction table of Friction DB
    session.query(Friction).\
                    where(Friction.FrictionId == FrictionId).\
                    update({'Way_id':Way_id})
    session.commit()


def get_friction_data(session: orm.Session, 
                      trip_id: int) -> List[Friction]:
    # return all available data in the Friction table in the Friction DB for given TripId
    return (session.query(Friction)
        .where(Friction.FK_Trip == trip_id)
        .all()
        ) 

def get_geometry_data(session: orm.Session) -> List[Geometry]:
    # return all available data in Geometry table in Friction DB 
    return (session.query(Geometry).all()
        ) 

