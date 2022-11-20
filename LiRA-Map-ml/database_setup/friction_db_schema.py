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

class RPMsReduced(pydantic.BaseModel):
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	rpm_value_fl: float
	FK_Trip: str


class RPMs(pydantic.BaseModel):    
	#RPMId: int
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	lat: float
	lon: float
	rpm_value_rl: str
	MapReferenceId: int
	lat_MapMatched: float
	lon_MapMatched: float
	wayPointName: str
	WayPoint: str
	FK_Trip: str


class RPM_rl(pydantic.BaseModel):    
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	T: str
	lon_MapMatched: float
	lat_MapMatched: float
	rpm_value_rl: float
	FK_Trip: str
	WayPoint_index: str
	wayPoint_Name: str
	legDistance_MapMatched: float
	Way_id: str
	Node_id: str
	lane: int
	direction: str


class RPM_fl(pydantic.BaseModel):    
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	T: str
	lat: float
	lon: float
	rpm_value_fl: float
	FK_Trip: str

    