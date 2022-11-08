#Author: Nina Oehlckers (s213535)
import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.ext.declarative import declarative_base
import datetime
from sqlalchemy.sql.expression import func
from sqlalchemy.dialects.postgresql import UUID
from lira_db_session import Base
import uuid

SRID = 4326

class Measurements(Base):
	__tablename__ = 'Measurements'

	MeasurementId = sqla.Column(sqla.String, primary_key=True)
	TS_or_Distance = sqla.Column(sqla.Date)
	Time_in_s = orm.column_property(func.to_char(TS_or_Distance, 'YYYY-MM-DD HH:MM:SS'))
	T = sqla.Column(sqla.String)	
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	message = sqla.Column(sqla.String)	
	isComputed = sqla.Column(sqla.Boolean)	
	FK_Trip = sqla.Column(sqla.String)
	#FK_Trip = sqla.Column(
	#	UUID(as_uuid=False),
	#	index=True,
    #    nullable=False,
    #    default=uuid.uuid4)
	FK_MeasurementType = sqla.Column(sqla.String, sqla.ForeignKey('MeasurementTypes.MeasumentTypeId'))	
	Created_Date = sqla.Column(sqla.Date) 
	Updated_Date = sqla.Column(sqla.Date)
	#Description = sqla.Column(sqla.String)

class MeasumentTypes(Base):
	__tablename__ = "MeasurementTypes"

	MeasumentTypeId = sqla.Column(sqla.String, primary_key=True)
	type = sqla.Column(sqla.String)
	Created_Date = sqla.Column(sqla.Date)

class MapReferences(Base):
	__tablename__ = 'MapReferences'

	MapReferenceId = sqla.Column(sqla.String, primary_key=True)
	lat_MapMatched = sqla.Column(sqla.Float)
	lon_MapMatched = sqla.Column(sqla.Float)	
	wayPointName = sqla.Column(sqla.Text)
	#legSummary_MapMatched = sqla.Column(sqla.String)
	#offset = sqla.Column(sqla.Text)	
	lane = sqla.Column(sqla.Text)	
	direction = sqla.Column(sqla.Text)	
	#PossibleMatchingRoutes = sqla.Column(sqla.Date) 
	WayPoint = sqla.Column(sqla.Text)
	FK_MeasurementId = sqla.Column(sqla.String, sqla.ForeignKey('Measurements.MeasurementId'))
	FK_Measurement = orm.relationship("Measurements", foreign_keys=[FK_MeasurementId])
	#FK_Section
