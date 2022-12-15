# created by Nina Oehlckers (s213535)

import pydantic
import datetime
import shapely.geometry


class RPM_rl1(pydantic.BaseModel):    
	MeasurementId: str
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
	geometry: shapely.geometry.LineString

	class Config:
		arbitrary_types_allowed = True

class RPM_rl(pydantic.BaseModel):    
	MeasurementId: str
	TS_or_Distance: datetime.datetime
	T: str
	lon_MapMatched: float
	lat_MapMatched: float
	rpm_value_rl: float
	FK_Trip: str
	legDistance_MapMatched: float
	Way_id: str
	Node_id: str
	lane: str
	direction: str

	class Config:
		arbitrary_types_allowed = True


class RPM_fl(pydantic.BaseModel):    
	MeasurementId: str
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

class Geometry(pydantic.BaseModel):   
	Way_id: str
	wayPoint_Name: str
	lane: int
	direction: str
	geometry: shapely.geometry.LineString
	dateUploaded: datetime.datetime

	class Config:
		arbitrary_types_allowed = True


class Friction_update_wayid(pydantic.BaseModel):
	FrictionId: int
	Way_id: str
    