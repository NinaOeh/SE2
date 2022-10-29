from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from lira_db_model import Base, Measurements
import lira_db_schema
import lira_db_session
from typing import List


router = APIRouter()
@router.get("/lira_measurements",response_model=List[lira_db_schema.Measurements])
def get_measurements(db: Session = Depends(lira_db_session.get_db)):
    def format_measurements(measurement: Measurements) -> lira_db_schema.Measurement:
        return lira_db_schema.Measurement(
                    MeasurementId=Measurements.MeasurementId,
                    T=T,
                    message=Measurements.message
                )
    measurements = map(format_measurements,
                lira_db_crud.get_measurements(
                    db))
    measurements = list(measurements)
    return measurements

