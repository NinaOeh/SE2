#Author: Nina Oehlckers (s213535)
import pydantic
import datetime
from pydantic.datetime_parse import parse_datetime


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

class Friction_reduced(pydantic.BaseModel):
	FK_Trip: str
	lat: float
	lon: float
	wayPointName: str
	Way_id: str

    