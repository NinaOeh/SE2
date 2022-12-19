# created by Nina Oehlckers (s213535)

import argparse
import sqlalchemy.exc
import os
from typing import List
from fastapi import Depends
import sqlalchemy.orm as orm
import pandas as pd

from lira_db_model import MapReferences
import friction_db_schema
import lira_db_schema
import lira_db_session
import lira_db_crud
import friction_db_session
import friction_db_crud
import friction_db_model
from scripts import calculations
import geoalchemy2.shape as ga_shape
import logging

def check_existing_geometries(db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        queries the geometry database to update if necessary in case geometries of trip are missing
        
        input: 
            db = orm.Session

        output:
            geometries_df = List[str]
    '''
    # extracting the existing wayids in the geometry database
    def get_geometry(geo: friction_db_model.Geometry) -> str:
        #extract wayid
        return geo.Way_id

    geos = list(map(get_geometry,friction_db_crud.get_geometry_data(session=db)))
    print(f"Geometry way_ids: {geos}")
    return geos


def get_mapref(offset: int,
            limit: int,
            tripid: str,
            geos: List[str],
            db: orm.Session = Depends(lira_db_session.get_db)):
    '''
        queries data from the MapReference database 
        to then gets the geometry per wayId from OSM API and uploads it
        into a geometry database

        input: 
            offset = int
            limit = int 
            tripid = str
            geos = List[str]
            db = orm.Session
    '''
    # extracting the rpm_rl mapping information for rpm_rl measurements
    def get_geometry(measurement: MapReferences) -> friction_db_schema.Friction_reduced:
        #parsing the measurements into the reduced mapreference schema
        return lira_db_schema.reducedMapReference(
            PossibleMatchingRoutes=measurement.PossibleMatchingRoutes,
            lane=measurement.lane if measurement.lane != None else '0',
            direction=measurement.direction if measurement.direction != None else '0',
            )
    if tripid == '0':  
        query_mapref_data = list(map(get_geometry,lira_db_crud.get_map_ref_red(session=db, 
                                                            offset=offset,
                                                            limit=limit)))
    else:
        print(tripid)
        query_mapref_data = list(map(get_geometry,lira_db_crud.get_map_ref_red_pertrip(session=db, 
                                                            offset=offset,
                                                            trip_id=tripid,
                                                            limit=limit)))
    mapref_df = pd.DataFrame([vars(m) for m in query_mapref_data])
    shape = mapref_df.shape[0]
    mapref_df = mapref_df.drop_duplicates()


    geo_infos = calculations.get_geometry_info(mapref_df)
    geo_infos_df = pd.DataFrame([vars(m) for m in geo_infos if m is not None])

    # drop those geometries that are already present in geometry database 
    geo_infos_df = geo_infos_df.loc[~(geo_infos_df['Way_id'].isin(geos))]
    return geo_infos_df, shape

def upload_geometry_data(geo_data: pd.DataFrame,
                         db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        uploads geometry data
        into a geometry table of the friction database

        input: 
            geodata = pd.DataFrame
            db = orm.Session
    '''
    for _,geo_info in geo_data.iterrows():
        try:
            with db.begin():
                friction_db_crud.insert_geometry_data(
                        session=db, 
                        wayPoint_Name=geo_info.wayPoint_Name,
                        Way_id=geo_info.Way_id,
                        lane=geo_info.lane,
                        direction=geo_info.direction,
                        geometry=ga_shape.from_shape(geo_info.geometry, srid=friction_db_model.SRID),
                        date=geo_info.dateUploaded)
                db.commit()   
        except sqlalchemy.exc.IntegrityError as exc:
            if 'duplicate key value violates unique constraint' in str(exc):
                if geo_info.wayPoint_Name != '0':
                    with db.begin():
                        friction_db_crud.update_wayPoint_Name(
                            session=db,
                            name=geo_info.wayPoint_Name,
                            Way_id=geo_info.Way_id
                        )
                    print(f'The geometry data for id {geo_info.Way_id} is already imported. The name was updated')
                else:
                    print(f'The geometry data for id {geo_info.Way_id} is already imported. The name was updated')

            else:
                print(exc)
                raise 
    print("Sub Query completed")

def upload_single_geometries(geos: List[str],
                            db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        uploads selected geometry informations
        into the geometry table of the friction database

        input: 
            geos = List[string]
            db = orm.Session
    '''
    geo_infos = calculations.get_geometry_info_by_wayid(geos)
    geo_infos_df = pd.DataFrame([vars(m) for m in geo_infos if m is not None])
    upload_geometry_data(geo_infos_df, db)



def update_geometry() -> None:
    """
    update the geometry columns of the Friction database

    
    No output
    """
    # set the arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('--batch_size', type=int, default=5000,
                        help='Optional: number of objects queried from the database at once. When chosen to be too large, program can crash because of Memory contraints.')
    parser.add_argument('--initial_offset', type=int, default=0,
                        help='Optional: default offset to start querying database from')
    parser.add_argument('--trip_id', type=str, default=0,
                        help='Trip ID if data from one specific Trip shall be uploaded.')
    args = parser.parse_args()

    # setup log file
    logging.basicConfig(filename=f'friction_update_{args.trip_id}.log', level=logging.INFO)

    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)

    #get existing geometries in Geometry database
    with friction_db_session.SessionLocal() as session:
        geos = check_existing_geometries(db=session)

    i = args.initial_offset
    rpmrl_size = args.batch_size
    iterator = 1
    while rpmrl_size == args.batch_size:
        print(f"Iteration: {iterator}")
        off = i
        with lira_db_session.SessionLocal() as session:
            geo_df, size = get_mapref(db=session,
                                      offset=off,
                                      limit=args.batch_size, 
                                      tripid=args.trip_id,
                                      geos=geos)
            rpmrl_size = size
        with friction_db_session.SessionLocal() as session:
            upload_geometry_data(db=session, geo_data=geo_df)

        i += args.batch_size
        iterator += 1

        logging.info(f'Files from {off} to {i} were uploaded.')
    logging.info('The upload has successfully finished.')
    print(f"Ca. {iterator*args.batch_size} rows of mapreference were checked for geometry and uploaded to database.")