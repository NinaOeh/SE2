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
import geoalchemy2.shape as ga_shape
import logging
import friction_db_crud
import friction_db_model
import friction_db_session
import friction_db_schema


def get_friction_data(trip_id: str,
                      db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        queries the friction data and removes outliers of wayids 
        by looking at neighbouring nodes

        input: 
            trip_id = str
            db = orm.Session

        output:
            friction_data = pandas.DataFrame
    '''
    # extracting the rpm_rl mapping information for rpm_rl measurements
    def get_friction(friction: friction_db_model.Friction) -> friction_db_schema.Friction_update_wayid:
        #parsing the measurements into the new mapreference schema
        return friction_db_schema.Friction_update_wayid(
            FrictionId=friction.FrictionId,
            Way_id=friction.Way_id
            )
    
    friction_data = list(map(get_friction,
                friction_db_crud.get_friction_data(session=db, trip_id=trip_id)))

    friction_data = pd.DataFrame([vars(m) for m in friction_data])

    friction_data['averaged_way_id'] = friction_data['Way_id'].rolling(window = 7, center=True, min_periods=1).apply(lambda x: x.mode()[0]).astype(int).astype(str)
    friction_data['Way_id'] = friction_data['Way_id'].astype(str)

    print(friction_data.shape)

    friction_data = friction_data.loc[friction_data['averaged_way_id'].ne(friction_data['Way_id'])]
    print(friction_data)
    return friction_data


def update_way_ids(friction_data: pd.DataFrame,
                   db: orm.Session = Depends(friction_db_session.get_db)):
    for _,fric_info in friction_data.iterrows():
        with db.begin():
            friction_db_crud.update_wayid(
                session=db,
                FrictionId=fric_info.FrictionId,
                Way_id=fric_info.averaged_way_id
            )
               

def remove_wayid_outliers() -> None:
    # set the arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('trip_id', type=str, 
                        help='The trip-id of the trip that shall be added to the friction database')
    
    args = parser.parse_args()

    # setup log file
    #logging.basicConfig(filename=f'geometry_update_{args.trip_id}.log', level=logging.INFO)

    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)

    #get existing geometries in Geometry database
    with friction_db_session.SessionLocal() as session:
        friction_data = get_friction_data(db=session,
                                 trip_id=args.trip_id)
    with friction_db_session.SessionLocal() as session:
        update_way_ids(friction_data=friction_data,
                       db=session)
    print(f"Way Ids for trip {args.trip_id} averaged.")
