import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.ext.declarative import declarative_base
import datetime
from sqlalchemy.sql.expression import func
from friction_db_session import Base


SRID = 4326

class Friction(Base):
	__tablename__ = 'Friction'
    
	FrictionId = sqla.Column(sqla.Integer, primary_key=True)
	MeasurementId = sqla.Column(sqla.String, unique=True)
	T = sqla.Column(sqla.String)	
	friction_value = sqla.Column(sqla.Float)
	message = sqla.Column(sqla.String)	
