import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.ext.declarative import declarative_base
import datetime
from sqlalchemy.sql.expression import func
from lira_db_session import Base

SRID = 4326

class Measurements(Base):
	__tablename__ = 'Measurements'

	MeasurementId = sqla.Column(sqla.String, primary_key=True)
	TS_or_Distance = sqla.Column(sqla.Date)
	T = sqla.Column(sqla.String)	
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	message = sqla.Column(sqla.String)	
	isComputed = sqla.Column(sqla.Boolean)	
	FK_MeasurementType = sqla.Column(sqla.String, sqla.ForeignKey('MeasurementTypes.MeasumentTypeId'))	
	Created_Date = sqla.Column(sqla.Date) 
	Updated_Date = sqla.Column(sqla.Date)
	#Description = sqla.Column(sqla.String)

class MeasumentTypes(Base):
	__tablename__ = "MeasurementTypes"

	MeasumentTypeId = sqla.Column(sqla.String, primary_key=True)
	type = sqla.Column(sqla.String)
	Created_Date = sqla.Column(sqla.Date)
