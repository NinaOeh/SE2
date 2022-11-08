#Author: Nina Oehlckers (s213535)
import pydantic
import datetime
from pydantic.datetime_parse import parse_datetime

class MeasurementInfo(pydantic.BaseModel):
    MeasurementId: str
    T: str
    friction_value: float
    message: str

    class Config:
        arbitrary_types_allowed = True

class RPMs(pydantic.BaseModel):    
	#RPMId: int
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	lat: float
	lon: float
	rpm_value: str

    