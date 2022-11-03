import pandas as pd
import pydantic
from typing import List
import friction_db_schema
import json

'''
    comments: we have to think of a smart and good way of what data we want to extract from the old
    database and insert into the new database! 
'''


def calculate_friction(message_string=str) -> float:
    '''
        Calculate the friction
    '''
    print(float(10000))
    return float(1.00000)

def extract_measurement_value(message_string=str) -> float:
    '''
        Extract the measurement value from the message
    '''
    message_dict = json.loads(message_string)
    message_keys = message_dict.keys()
    if 'obd.rpm_fl.value' in message_keys:
        print("here is a measurement")
        return message_dict['obd.rpm_fl.value']

    if 'obd.rpm_rl.value' in message_keys:
        print("here is a measurement")
        return message_dict['obd.rpm_rl.value']


def get_friction_info(friction_df: pd.DataFrame) -> List[friction_db_schema.MeasurementInfo]:
    def parse(row):
        return friction_db_schema.MeasurementInfo(
            MeasurementId=row['MeasurementId'],
            T=row['T'],
            friction_value=calculate_friction(row['message']),
            message=row['message']
        )
    return (parse(row) for _, row in friction_df.iterrows())

def get_rpm_info(df: pd.DataFrame) -> List[friction_db_schema.MeasurementInfo]:
    def parse(row):
        rpm = extract_measurement_value(row['message'])
        if rpm!=None:
            return friction_db_schema.RPMs(
                MeasurementId=row['MeasurementId'],
                TS_or_Distance=row['TS_or_Distance'],
                lat=row['lat'],
                lon=row['lon'],
                rpm_value=extract_measurement_value(row['message']),
                MapReferenceId=row['MapReferenceId'],
                lat_MapMatched=row['lat_MapMatched'],
                lon_MapMatched=row['lon_MapMatched'],
                wayPointName=row['wayPointName'],
                WayPoint=row['WayPoint']
            )
        else:
            pass
    return (parse(row) for _, row in df.iterrows())
