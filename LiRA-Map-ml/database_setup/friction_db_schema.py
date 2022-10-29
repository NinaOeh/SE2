#Author: Nina Oehlckers (s213535)
import pydantic

class MeasurementInfo(pydantic.BaseModel):
    MeasurementId: str
    T: str
    friction_value: float
    message: str

    class Config:
        arbitrary_types_allowed = True