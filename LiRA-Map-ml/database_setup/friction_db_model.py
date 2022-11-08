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
<<<<<<< HEAD
=======
	message = sqla.Column(sqla.String)	
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8

class RPMs(Base):
	__tablename__ = 'RPMs'
    
	RPMId = sqla.Column(sqla.Integer, primary_key=True)
<<<<<<< HEAD
	TS_or_Distance = sqla.Column(sqla.Date)
=======
	MeasurementId = sqla.Column(sqla.String, unique=True) #macht keinen Sinn
	TS_or_Distance = sqla.Column(sqla.Date)
	T = sqla.Column(sqla.String)	# macht keinen Sinn
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
	lat = sqla.Column(sqla.Float)
	lon = sqla.Column(sqla.Float)
	rpm_fl_value = sqla.Column(sqla.Float)
	rpm_rl_value = sqla.Column(sqla.Float)
<<<<<<< HEAD

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
=======
>>>>>>> d1499c81d2cab486ab1b6aafdd812e0f35c3dfc8
