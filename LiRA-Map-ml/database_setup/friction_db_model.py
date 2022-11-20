#Author: Nina Oehlckers (s213535)
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
	TS_or_Distance = sqla.Column(sqla.DateTime)
	mapped_lat = sqla.Column(sqla.Float)
	mapped_lon = sqla.Column(sqla.Float)
	rpm_fl_value = sqla.Column(sqla.Float)
	rpm_rl_value = sqla.Column(sqla.Float)
	friction_value = sqla.Column(sqla.Float)
	FK_Trip = sqla.Column(sqla.String)
	MeasurementId_rl = sqla.Column(sqla.String, unique=True)
	Node_id = sqla.Column(sqla.Integer)
	WayPoint_index = sqla.Column(sqla.String)
	wayPoint_Name = sqla.Column(sqla.String)
	legDistance_MapMatched = sqla.Column(sqla.Float)
	Way_id = sqla.Column(sqla.String)
	Node_id = sqla.Column(sqla.String)
	lane = sqla.Column(sqla.Integer)
	direction = sqla.Column(sqla.String)

class RPMs(Base):
	__tablename__ = 'RPMs'
    
	RPMId = sqla.Column(sqla.Integer, primary_key=True)
	TS_or_Distance = sqla.Column(sqla.Date)
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	rpm_fl_value = sqla.Column(sqla.Float)
	rpm_rl_value = sqla.Column(sqla.Float)

class RPM_fl(Base):
	__tablename__ = 'RPM_fl'
    
	MeasurementId = sqla.Column(sqla.String, primary_key=True) 
	TS_or_Distance = sqla.Column(sqla.Date)
	T = sqla.Column(sqla.String)	
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	rpm_fl_value = sqla.Column(sqla.Float)


class RPM_rl(Base):
	__tablename__ = 'RPM_rl'
    
	MeasurementId = sqla.Column(sqla.String, primary_key=True) 
	TS_or_Distance = sqla.Column(sqla.Date)
	T = sqla.Column(sqla.String)	
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	rpm_rl_value = sqla.Column(sqla.Float)
