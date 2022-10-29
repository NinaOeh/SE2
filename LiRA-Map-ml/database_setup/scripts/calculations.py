import pandas as pd
import pydantic
from typing import List
import friction_db_schema

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


def get_friction_info(friction_df: pd.DataFrame) -> List[friction_db_schema.MeasurementInfo]:
    def parse(row):
        return friction_db_schema.MeasurementInfo(
            MeasurementId=row['MeasurementId'],
            T=row['T'],
            friction_value=calculate_friction(row['message']),
            message=row['message']
        )
    return (parse(row) for _, row in friction_df.iterrows())