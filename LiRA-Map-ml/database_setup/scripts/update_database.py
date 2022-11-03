import argparse
import os
import sqlalchemy.exc
import os
from fastapi.responses import HTMLResponse
from typing import List
from fastapi import Depends, FastAPI
import sqlalchemy.orm as orm
import pandas as pd
import sqlalchemy as sqla
import numpy as np

from lira_db_model import Measurements, MapReferences
import lira_db_schema
import lira_db_session
import lira_db_crud
import friction_db_session
import friction_db_crud
import friction_db_model
from scripts import calculations


def convert_lira_measurements(db: orm.Session = Depends(lira_db_session.get_db)) -> List[lira_db_schema.Measurement]:
    '''
        queries the necessary data from the LiRA database 
        to be able to calculate and display the 
        friction in the LiRA Map from  LiRA measurements

        input: 
            db = orm.Session
        output:
            friction_data = pandas.DataFrame
    '''
    def format_measurements(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=measurement.MeasurementId,
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message
            )
    friction_data = map(format_measurements,
                lira_db_crud.get_measurements(
                    db))
    friction_data=list(friction_data)
    friction_data = pd.DataFrame([vars(m) for m in friction_data])

    def getrpmrl(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=measurement.MeasurementId,
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message
            )
    rpmrl_data_1 = map(getrpmrl,
                lira_db_crud.get_rl(
                    db))
    rpmrl_data_1 = list(rpmrl_data_1)
    rpmrl_data_1 = pd.DataFrame([vars(m) for m in rpmrl_data_1])
    print(rpmrl_data_1)

    def getrpmrl_ref(measurement: MapReferences) -> lira_db_schema.MapReferences:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.MapReferences(
            MapReferenceId=measurement.MapReferenceId,
            lat_MapMatched=measurement.lat_MapMatched,
            lon_MapMatched=measurement.lon_MapMatched,
            wayPointName=measurement.wayPointName,
            #lane=measurement.lane,
            #direction=measurement.direction,
            WayPoint=measurement.WayPoint,
            MeasurementId=measurement.FK_MeasurementId
            )
    rpmrl_data_2 = map(getrpmrl_ref,
                lira_db_crud.get_rl_ref(
                    db))
    rpmrl_data_2 = list(rpmrl_data_2)
    rpmrl_data_2 = pd.DataFrame([vars(m) for m in rpmrl_data_2])

    rpmrl_data = pd.merge(rpmrl_data_1, rpmrl_data_2, how='outer', on='MeasurementId')
    

    def getrpmfl(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=measurement.MeasurementId,
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message
            )
    rpmfl_data_1 = map(getrpmfl,
                lira_db_crud.get_fl(
                    db))
    rpmfl_data_1 = list(rpmfl_data_1)
    rpmfl_data_1 = pd.DataFrame([vars(m) for m in rpmfl_data_1])

    def getrpmfl_ref(measurement: MapReferences) -> lira_db_schema.MapReferences:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.MapReferences(
            MapReferenceId=measurement.MapReferenceId,
            lat_MapMatched=measurement.lat_MapMatched,
            lon_MapMatched=measurement.lon_MapMatched,
            wayPointName=measurement.wayPointName,
            #lane=measurement.lane,
            #direction=measurement.direction,
            WayPoint=measurement.WayPoint,
            MeasurementId=measurement.FK_MeasurementId
            )
    rpmfl_data_2 = map(getrpmfl_ref,
                lira_db_crud.get_fl_ref(
                    db))
    rpmfl_data_2 = list(rpmfl_data_2)
    rpmfl_data_2 = pd.DataFrame([vars(m) for m in rpmfl_data_2])

    rpmfl_data = pd.merge(rpmfl_data_1, rpmfl_data_2, how='outer', on='MeasurementId')
    #print(rpmfl_data)


    return friction_data, rpmrl_data, rpmfl_data

def upload_to_friction_database(db: orm.Session = Depends(lira_db_session.get_db), 
    friction_data=pd.DataFrame,
    rpm_fl_data=pd.DataFrame,
    rpm_rl_data=pd.DataFrame) -> None:
    '''
        calculate the friction and upload the relevant data 
        to the new friction database

        input: 
            db = orm.Session
            friction_data = pandas.DataFrame
        output:
            None
    '''
    
    print("hi")
    friction_infos=calculations.get_friction_info(friction_data) 
    print(list(friction_infos))

    rpm_fl_infos = calculations.get_rpm_info(rpm_fl_data)
    rpm_rl_infos = calculations.get_rpm_info(rpm_rl_data)

    #print(f"rpm_fl_infos: {list(rpm_fl_infos)}")
    #print(f"rpm_rl_infos: {list(rpm_rl_infos)}")

    rpm_fl_infos_df = pd.DataFrame([vars(m) for m in rpm_fl_infos if m is not None])
    rpm_rl_infos_df = pd.DataFrame([vars(m) for m in rpm_rl_infos if m is not None])

    print(rpm_fl_infos_df)
    print(rpm_rl_infos_df)
    #print(rpm_fl_infos_df[rpm_fl_infos_df['TS_or_Distance'].intersect(rpm_rl_infos_df['TS_or_Distance'])])

    rpm_merged_info = pd.merge(rpm_fl_infos_df, rpm_rl_infos_df, how='inner', on='TS_or_Distance')
    print(rpm_merged_info)
    
    '''with db.begin():
        for fric_info in friction_infos:   
            try:
                friction_db_crud.insert_friction_data(
                        session=db, 
                        MId=fric_info.MeasurementId,
                        T=fric_info.T,
                        value=fric_info.friction_value,
                        message=fric_info.message)
                    
            except sqlalchemy.exc.IntegrityError as exc:
                if 'duplicate key value violates unique constraint' in str(exc):
                    print(f'The Friction data for id {fric_info.MeasurementId} is already imported')
                    return
                else:
                    raise 
        db.commit()
        print("Query completed")
    '''

def update_database() -> None:
    """
    Queries the desired data from the LiRA database,
    calculates the friction and uploads the data into
    the friction database

    Expects no input, no output
    """
    with lira_db_session.SessionLocal() as session:
        measurements, rpmrl_data, rpmfl_data = convert_lira_measurements(session)
        #print(measurements)
        #print(rpmrl_data)
        #print(rpmfl_data)
    #with friction_db_session.friction_engine.connect() as connection:
    #    connection.execute(sqla.text('CREATE EXTENSION IF NOT EXISTS postgis'))
    #    connection.commit()
    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)
    
    with friction_db_session.create_session(friction_db_session.friction_engine) as session:
        upload_to_friction_database(session, measurements, rpmrl_data, rpmfl_data)
