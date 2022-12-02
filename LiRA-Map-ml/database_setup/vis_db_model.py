#Author: Nina Oehlckers (s213535)
import sqlalchemy as sqla
from sqlalchemy.ext.declarative import declarative_base
from lira_db_session import Base
import geoalchemy2 as ga


SRID = 4326

class Geometry(Base):
	__tablename__ = 'way'

	id = sqla.Column(sqla.String, primary_key=True)
	geom = sqla.Column(
        ga.Geometry('LINESTRING', srid=SRID, nullable=False)
        )

