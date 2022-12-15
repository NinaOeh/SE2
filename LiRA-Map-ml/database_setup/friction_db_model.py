# created by Nina Oehlckers (s213535)

import sqlalchemy as sqla
from friction_db_session import Base
import geoalchemy2 as ga


SRID = 4326

class Geometry(Base):
	__tablename__= 'Geometry'

	Way_id = sqla.Column(sqla.String, primary_key=True)
	lane = sqla.Column(sqla.Integer)
	direction = sqla.Column(sqla.String)
	wayPoint_Name = sqla.Column(sqla.String)
	geometry = sqla.Column(
        ga.Geometry('LINESTRING', srid=SRID),
        nullable=False
        )
	dateUploaded = sqla.Column(sqla.DateTime)


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
	Node_id = sqla.Column(sqla.String)
	legDistance_MapMatched = sqla.Column(sqla.Float)
	Way_id = sqla.Column(sqla.String, sqla.ForeignKey('Geometry.Way_id'))
