# created by Nina Oehlckers (s213535)

import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.sql.expression import func
from lira_db_session import Base

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
	FK_MeasurementType = sqla.Column(sqla.String, sqla.ForeignKey('MeasurementTypes.MeasumentTypeId'))	
	Created_Date = sqla.Column(sqla.Date) 
	Updated_Date = sqla.Column(sqla.Date)


class MapReferences(Base):
	__tablename__ = 'MapReferences'

	MapReferenceId = sqla.Column(sqla.String, primary_key=True)
	lat_MapMatched = sqla.Column(sqla.Float)
	lon_MapMatched = sqla.Column(sqla.Float)	
	wayPointName = sqla.Column(sqla.Text)
	lane = sqla.Column(sqla.Text)	
	direction = sqla.Column(sqla.Text)	
	legDistance_MapMatched = sqla.Column(sqla.Float)
	WayPoint = sqla.Column(sqla.Text)
	FK_MeasurementId = sqla.Column(sqla.String, sqla.ForeignKey('Measurements.MeasurementId'))
	FK_Measurement = orm.relationship("Measurements", foreign_keys=[FK_MeasurementId])
	FK_Section = sqla.Column(sqla.Text)
	PossibleMatchingRoutes = sqla.Column(sqla.Text)
	
