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

from lira_db_model import Measurements
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
        print(measurement.MeasurementId)
        print(measurement.T)
        print(measurement.message)
        return lira_db_schema.Measurement(
            MeasurementId=measurement.MeasurementId,
            T=measurement.T,
            message=measurement.message
            )
    friction_data = map(format_measurements,
                lira_db_crud.get_measurements(
                    db))
    friction_data=list(friction_data)
    friction_data = pd.DataFrame([vars(m) for m in friction_data])
    return friction_data

def upload_to_friction_database(db: orm.Session = Depends(lira_db_session.get_db), 
    friction_data = pd.DataFrame) -> None:
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
    
    with db.begin():
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

def update_database() -> None:
    """
    Queries the desired data from the LiRA database,
    calculates the friction and uploads the data into
    the friction database

    Expects no input, no output
    """
    with lira_db_session.SessionLocal() as session:
        measurements = convert_lira_measurements(session)
        print(measurements)
    #with friction_db_session.friction_engine.connect() as connection:
    #    connection.execute(sqla.text('CREATE EXTENSION IF NOT EXISTS postgis'))
    #    connection.commit()
    friction_db_model.Base.metadata.create_all(bind=friction_db_session.friction_engine)
    with friction_db_session.create_session(friction_db_session.friction_engine) as session:
        upload_to_friction_database(session, measurements)
