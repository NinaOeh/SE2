#Author: Nina Oehlckers (s213535)
import pydantic
import shapely.geometry



class Geometry(pydantic.BaseModel):
	id: str
	geometry: shapely.geometry.LineString

	class Config:
		arbitrary_types_allowed = True

	
