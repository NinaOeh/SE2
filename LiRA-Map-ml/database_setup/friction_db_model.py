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
	TS_or_Distance = sqla.Column(sqla.Date)
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	rpm_fl_value = sqla.Column(sqla.Float)
	rpm_rl_value = sqla.Column(sqla.Float)
	friction_value = sqla.Column(sqla.Float)

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
