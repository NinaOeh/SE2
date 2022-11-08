#Author: Nina Oehlckers (s213535)
import pydantic
import datetime

class Measurement(pydantic.BaseModel):
	MeasurementId: int
	TS_or_Distance: datetime.datetime
	T: str	
	lat: float
	lon: float
<<<<<<< HEAD
	message: str
	FK_Trip: str	
=======
	message: str	
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8

class MapReferences(pydantic.BaseModel):
	MapReferenceId: int
	lat_MapMatched: float
	lon_MapMatched: float
	wayPointName: str
	#legSummary_MapMatched = sqla.Column(sqla.String)
	#offset: str
	#lane: str
	#direction: str
	#PossibleMatchingRoutes = sqla.Column(sqla.Date) 
	WayPoint: str
<<<<<<< HEAD
	MeasurementId: int
	
=======
	MeasurementId: int
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
