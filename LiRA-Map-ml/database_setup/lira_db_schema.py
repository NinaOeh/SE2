import pydantic
import datetime

class Measurement(pydantic.BaseModel):
	MeasurementId: int
	#TS_or_Distance: datetime.datetime
	T: str	
	#lat: float
	#lon: float
	message: str	