# created by Nina Oehlckers (s213535)

import pydantic
import datetime

class Measurement(pydantic.BaseModel):
	MeasurementId: str
	TS_or_Distance: datetime.datetime
	T: str	
	lat: float
	lon: float
	message: str
	FK_Trip: str	

class MapReferencesFriction(pydantic.BaseModel):
	MapReferenceId: int
	lat_MapMatched: float
	lon_MapMatched: float
	legDistance_MapMatched: float
	MeasurementId: str
	FK_Section: str
	PossibleMatchingRoutes: str
	WayPoint: str

class reducedMapReference(pydantic.BaseModel):
	PossibleMatchingRoutes: str
	lane: str
	direction: str
	
