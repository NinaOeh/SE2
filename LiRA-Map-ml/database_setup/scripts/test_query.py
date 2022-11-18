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
            rpmrl_data = pandas.DataFrame
            rpmfl_data = pandas.DataFrame
    '''

    #Getting the rpm_rl measurements for those parts of the road that are already mapped
    def getrpmrl(measurement: Measurements) -> lira_db_schema.Measurement:
        #parsing the measurements into the new measurements schema
        return lira_db_schema.Measurement(
            MeasurementId=measurement.MeasurementId,
            T=measurement.T,
            TS_or_Distance=measurement.TS_or_Distance,
            lat=measurement.lat,
            lon=measurement.lon,
            message=measurement.message,
            FK_Trip=str(measurement.FK_Trip)
            )
    rpmrl_data_1 = map(getrpmrl,
                lira_db_crud.get_rl_1(
                    db))
    rpmrl_data_1 = list(rpmrl_data_1)
    rpmrl_data_1 = pd.DataFrame([vars(m) for m in rpmrl_data_1])
    print(rpmrl_data_1)

    #Getting the rpm_rl mapping information for rpm_rl measurements
    def getrpmrl_ref(measurement: MapReferences) -> lira_db_schema.MapReferences:
        #parsing the measurements into the new mapreference schema
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
    print(rpmrl_data)  

    # def getrpmfl(measurement: Measurements) -> lira_db_schema.Measurement:
    #     #parsing the measurements into the new measurements schema
    #     return lira_db_schema.Measurement(
    #         MeasurementId=measurement.MeasurementId,
    #         T=measurement.T,
    #         TS_or_Distance=measurement.TS_or_Distance,
    #         lat=measurement.lat,
    #         lon=measurement.lon,
    #         message=measurement.message,
    #         FK_Trip=str(measurement.FK_Trip)
    #         )
    # rpmfl_data = map(getrpmfl,
    #             lira_db_crud.get_fl_1(
    #                 db))
    # rpmfl_data = list(rpmfl_data)
    # rpmfl_data = pd.DataFrame([vars(m) for m in rpmfl_data])

    return rpmrl_data #_1, rpmfl_data

def upload_to_friction_database(db: orm.Session = Depends(lira_db_session.get_db), 
    rpm_fl_data=pd.DataFrame,
    rpm_rl_data=pd.DataFrame) -> None:
    '''
        calculate the friction and upload the relevant data 
        to the new friction database

        input: 
            db = orm.Session
            rpm_fl_data = pandas.DataFrame
            rpm_rl_data = pandas.DataFrame
        output:
            None
    '''

    rpm_fl_infos = calculations.get_rpm_info_fl_2(rpm_fl_data)
    rpm_rl_infos = calculations.get_rpm_info_rl_2(rpm_rl_data)

    rpm_fl_infos_df = pd.DataFrame([vars(m) for m in rpm_fl_infos if m is not None])
    rpm_rl_infos_df = pd.DataFrame([vars(m) for m in rpm_rl_infos if m is not None])


    #merge the dataframes based on the closest values in time
    merge_rl_fl = rpm_fl_infos_df.merge(rpm_rl_infos_df, how='cross', suffixes = ('_fl', '_rl'))
    M = merge_rl_fl.groupby('TS_or_Distance_fl').apply(lambda x:abs(x['TS_or_Distance_fl']-x['TS_or_Distance_rl'])==abs(x['TS_or_Distance_fl']-x['TS_or_Distance_rl']).min())
    # and x['FK_Trip_rl'].all()==x['FK_Trip_fl'].all() --> Find out how to filter by these uuid values!!!
    merge_rl_fl = merge_rl_fl[M.values].drop_duplicates()
    merge_rl_fl['av_lat'] = (merge_rl_fl['lat_fl']+merge_rl_fl['lat_rl'])/2
    merge_rl_fl['av_lon'] = (merge_rl_fl['lon_fl']+merge_rl_fl['lon_rl'])/2
    merge_rl_fl=merge_rl_fl.drop(['lat_fl','lat_rl','lon_fl','lon_rl'],axis=1)
    merge_rl_fl['friction'] = calculations.estimateFrictionCoefficient(
        rpm_fl=merge_rl_fl['rpm_value_fl'].values, #to_numpy().reshape(len(merge_rl_fl['rpm_value_fl']),1).T
        rpm_rl=merge_rl_fl['rpm_value_rl'].values
    )
    print(merge_rl_fl)

    #concatenate the dataframes, filter by timestamp and interpolate the missing values
    df_inter = pd.concat([rpm_fl_infos_df, rpm_rl_infos_df], ignore_index = True)
    df_inter = df_inter.sort_values(by='TS_or_Distance')
    df_inter['rpm_value_fl'] = df_inter['rpm_value_fl'].interpolate()
    df_inter['rpm_value_rl'] = df_inter['rpm_value_rl'].interpolate()
    print(df_inter)

    #only keep every 30th item
    reduced_df = df_inter.iloc[1::30, :]
    reduced_df['friction'] = calculations.estimateFrictionCoefficient(
        rpm_fl=reduced_df['rpm_value_fl'].values, #to_numpy().reshape(len(merge_rl_fl['rpm_value_fl']),1).T
        rpm_rl=reduced_df['rpm_value_rl'].values
    )
    print(reduced_df)
    

def test_query() -> None:
    """
    Queries the desired data from the LiRA database,
    calculates the friction and uploads the data into
    the friction database

    Expects no input, no output
    """
    with lira_db_session.SessionLocal() as session:
        rpmrl_data, rpmfl_data = convert_lira_measurements(session)

    #with friction_db_session.friction_engine.connect() as connection:
    #    connection.execute(sqla.text('CREATE EXTENSION IF NOT EXISTS postgis'))
    #    connection.commit()
    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)
    print(rpmfl_data.shape)
    print(rpmrl_data.shape)
    
    with friction_db_session.create_session(friction_db_session.friction_engine) as session:
        upload_to_friction_database(
            db = session, 
            rpm_fl_data=rpmfl_data,
            rpm_rl_data=rpmrl_data)
