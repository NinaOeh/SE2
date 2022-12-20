# created by Nina Oehlckers (s213535)

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


from lira_db_model import Measurements, MapReferences
import lira_db_schema
import lira_db_session
import lira_db_crud
import friction_db_session
import friction_db_crud
import friction_db_model
from scripts import calculations
import geoalchemy2.shape as ga_shape
import logging
from scripts.update_geometry_table import upload_single_geometries


def merge_rl_fl(
    rl_data: pd.DataFrame,
    fl_data: pd.DataFrame,
    geos: List[str]):
    '''
        merges the two measurements together, 
        calculating a linear interpolation and only keeping those 
        measurements that have are map matched

        input: 
            rpm_fl_data = pandas.DataFrame
            rpm_rl_data = pandas.DataFrame
        output:
            merged_data = pandas.DataFrame
    '''

    # extract the actual rpm values from the data
    rpm_fl_infos = calculations.get_rpm_info_fl(fl_data)
    rpm_rl_infos = calculations.get_rpm_info_rl(rl_data)

    rpm_fl_infos_df = pd.DataFrame([vars(m) for m in rpm_fl_infos if m is not None])
    rpm_rl_infos_df = pd.DataFrame([vars(m) for m in rpm_rl_infos if m is not None])

    # concatenate the dataframes, filter by timestamp and interpolate the missing values
    # using pandas included interpolation function
    df_inter = pd.concat([rpm_fl_infos_df, rpm_rl_infos_df], ignore_index = True)
    df_inter = df_inter.sort_values(by='TS_or_Distance')
    df_inter['rpm_value_fl'] = df_inter['rpm_value_fl'].interpolate()

    # remove the map matched items
    merged_data = df_inter.dropna(subset = ['rpm_value_rl'])

    #only keep every 30th item
    merged_data = merged_data.iloc[1::50, :]

    geos_of_df = merged_data['Way_id'].unique()
    geos_to_add = list(set(geos_of_df) - set(geos))

    return merged_data, geos_to_add

def check_existing_geometries(db: orm.Session = Depends(friction_db_session.get_db)):
    '''
        queries the eometry database to update if necessary in case geometries of trip are missing
        
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
    return geos


def convert_lira_measurements(offset: int,
            limit: int,
            trip_id: str,
            geos: List[str],
            db: orm.Session = Depends(lira_db_session.get_db)) -> List[lira_db_schema.Measurement]:
    '''
        queries the necessary data from the LiRA database 
        to be able to calculate and display the 
        friction in the LiRA Map from  LiRA measurements

        input: 
            batch_size = int 
            trip_id = str
            db = orm.Session

        output:
            rpmrl_rpmfl_data = pandas.DataFrame
    '''
    # extracting the rpm_rl mapping information for rpm_rl measurements
    def getrpmrl_mapref(measurement: MapReferences) -> lira_db_schema.MapReferencesFriction:
        #parsing the measurements into the new mapreference schema
        return lira_db_schema.MapReferencesFriction(
            MapReferenceId=measurement.MapReferenceId,
            lat_MapMatched=measurement.lat_MapMatched,
            lon_MapMatched=measurement.lon_MapMatched,
            MeasurementId=str(measurement.FK_MeasurementId),
            legDistance_MapMatched=measurement.legDistance_MapMatched if measurement.legDistance_MapMatched != None else 0,
            FK_Section=measurement.FK_Section if measurement.FK_Section != None else '0',
            PossibleMatchingRoutes=measurement.PossibleMatchingRoutes,
            WayPoint = measurement.WayPoint
            )
    # extracting the rpm_rl measurements
    def getrpmrl_measurement(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=str(measurement.MeasurementId),
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message,
            FK_Trip=str(measurement.FK_Trip)
            )
    rpmrl_query_data = list(map(list, 
                           zip(*lira_db_crud.get_rl_mapref(session=db, 
                                                           offset=offset,
                                                           limit=limit,
                                                           trip_id=trip_id))))
    rpmrl_data_mapref = list(map(getrpmrl_mapref,
                rpmrl_query_data[0]))
    rpmrl_data_measurements = list(map(getrpmrl_measurement,
                rpmrl_query_data[1]))
    rpmrl_df_mapref = pd.DataFrame([vars(m) for m in rpmrl_data_mapref])
    rpmrl_df_measurements = pd.DataFrame([vars(m) for m in rpmrl_data_measurements])


    rpmrl_data = pd.merge(rpmrl_df_mapref, rpmrl_df_measurements, how='outer', on='MeasurementId')

    latest_rl_time = rpmrl_data.sort_values(by='TS_or_Distance')['TS_or_Distance'].iloc[-1] + timedelta(minutes=1)
    earliest_rl_time = rpmrl_data.sort_values(by='TS_or_Distance')['TS_or_Distance'].iloc[0] - timedelta(minutes=1)

    # Query the fl values 
    def getrpmfl(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=str(measurement.MeasurementId),
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message,
            FK_Trip=str(measurement.FK_Trip)
            )
    rpmfl_data = map(getrpmfl,
                lira_db_crud.get_fl(
                    session=db,
                    earliest_time=earliest_rl_time,
                    latest_time=latest_rl_time,
                    trip_id=trip_id))
    rpmfl_data = list(rpmfl_data)
    rpmfl_data = pd.DataFrame([vars(m) for m in rpmfl_data])

    # merge two measurements into one dataframe
    rpmrl_rpmfl_data, geos_to_add = merge_rl_fl(rl_data=rpmrl_data, fl_data=rpmfl_data, geos=geos)

    return rpmrl_rpmfl_data, rpmrl_data.shape[0], geos_to_add

def upload_to_friction_database(db: orm.Session = Depends(lira_db_session.get_db), 
                                rpmrl_rpmfl_data=pd.DataFrame) -> None:
    '''
        calculate the friction and upload the relevant data 
        to the new friction database

        input: 
            db = orm.Session
            rpm_data = pandas.DataFrame
        output:
            None
    '''

    rpmrl_rpmfl_data['friction'] = calculations.estimateFrictionCoefficient(
        rpm_fl=rpmrl_rpmfl_data['rpm_value_fl'].values, #to_numpy().reshape(len(merge_rl_fl['rpm_value_fl']),1).T
        rpm_rl=rpmrl_rpmfl_data['rpm_value_rl'].values
    )

    for _,fric_info in rpmrl_rpmfl_data.iterrows():  
        try:
            with db.begin():
                friction_db_crud.insert_only_friction_data(
                        session=db, 
                        timestamp=fric_info.TS_or_Distance,
                        friction_value=fric_info.friction,
                        lon=fric_info.lon_MapMatched,
                        lat=fric_info.lat_MapMatched,
                        rpm_fl=fric_info.rpm_value_fl,
                        rpm_rl=fric_info.rpm_value_rl,
                        FK_Trip=fric_info.FK_Trip,
                        MeasurementId_rl=fric_info.MeasurementId,
                        legDistance_MapMatched=fric_info.legDistance_MapMatched,
                        Way_id=fric_info.Way_id,
                        Node_id=str(fric_info.Node_id),
                        )
                db.commit()   
        except sqlalchemy.exc.IntegrityError as exc:
            if 'duplicate key value violates unique constraint' in str(exc):
                print(f'The Friction data for id {fric_info.MeasurementId} is already imported')

            else:
                print(exc)
                raise 
    print("Sub Query completed")
    

def update_friction_full_workflow() -> None:
    """
    Queries the desired data from the LiRA database,
    checks the geometries and generates missing geometries,
    calculates the friction and uploads the data into
    the friction database
    
    No output
    """
    # set the arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('trip_id', type=str, 
                        help='The trip-id of the trip that shall be added to the friction database')
    parser.add_argument('--batch_size', type=int, default=5000,
                        help='Optional: number of objects queried from the database at once. When chosen to be too large, program can crash because of Memory contraints.')
    parser.add_argument('--initial_offset', type=int, default=0,
                        help='Optional: default offset to start querying database from')
    args = parser.parse_args()

    # setup log file
    logging.basicConfig(filename=f'geometry_update_{args.trip_id}.log', level=logging.INFO)

    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)

    #get existing geometries in Geometry database
    with friction_db_session.SessionLocal() as session:
        geos = check_existing_geometries(db=session)


    i = args.initial_offset
    rpmrl_size = args.batch_size
    iterator = 1
    while rpmrl_size == args.batch_size:
        print(f"Iteration: {iterator}")
        trip_id = args.trip_id
        off = i 

        with lira_db_session.SessionLocal() as session:
            rpmrl_rpmfl_data, rpmrl_size, geos_to_add = convert_lira_measurements(db=session, 
                                                         offset=off, 
                                                         limit=args.batch_size,
                                                         geos=geos,
                                                         trip_id=trip_id)

        friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)
        
        with friction_db_session.SessionLocal() as session:
            if len(geos_to_add)>0:
                upload_single_geometries(db=session, geos=geos_to_add)
                print("Missing geometries added")
            upload_to_friction_database(
                db = session, 
                rpmrl_rpmfl_data=rpmrl_rpmfl_data)
        i += args.batch_size
        iterator += 1
        logging.info(f'Files from {off} to {i} were uploaded.')
    logging.info('The uploadhas successfully finished.')
    print(f"Trip {args.trip_id} uploaded to database.")
