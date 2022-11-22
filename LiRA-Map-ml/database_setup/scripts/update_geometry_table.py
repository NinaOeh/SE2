import argparse
import os
import sqlalchemy.exc
import os
from typing import List
from fastapi import Depends
import sqlalchemy.orm as orm
import pandas as pd
from datetime import datetime, timedelta
import psycopg2
from shapely.geometry import LineString


from friction_db_model import Friction
import friction_db_schema
import lira_db_session
import lira_db_crud
import friction_db_session
import friction_db_crud
import friction_db_model
from scripts import calculations


def create_geometry_from_friction_data(offset: int,
            limit: int,
            trip_id: str,
            db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        queries data from the Friction database 
        to be generate the LineStrings per Wayid
        friction in the LiRA Map from  LiRA measurements

        input: 
            batch_size = int 
            trip_id = str
            db = orm.Session
    '''
    # extracting the rpm_rl mapping information for rpm_rl measurements
    def get_friction(friction: Friction) -> friction_db_schema.Friction_reduced:
        #parsing the measurements into the new mapreference schema
        return friction_db_schema.Friction_reduced(
            	FK_Trip=friction_db_model.FK_Trip,
                lat=friction_db_model.mapped_lat,
                lon=friction_db_model.mapped_lon,
                wayPointName=friction_db_model.wayPoint_Name,
                Way_id=friction_db_model.Way_id
            )
    query_friction_data = list(map(list, 
                           zip(*friction_db_crud.get_friction(session=db, 
                                                           offset=offset,
                                                           limit=limit))))
    friction_df = pd.DataFrame([vars(m) for m in query_friction_data])
    #TODO: for insertions in the friction database that have the same WayId, create a linestring with the lat/lon coordinates
    # create a postgis extension for thepostgres database
    line = LineString([min_lon_coord, max_lon_coord])

