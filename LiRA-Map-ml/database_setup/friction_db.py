from typing import List, Tuple
import geoalchemy2 as ga
import geoalchemy2.shape as ga_shape
import shapely.geometry
import sqlalchemy as sqla
import sqlalchemy.orm as orm
from sqlalchemy.ext.declarative import declarative_base
import datetime
from sqlalchemy.sql.expression import func

SRID = 4326

Base = declarative_base()


class Friction(Base):
    __tablename__ = 'friction'

    way_id = sqla.Column(sqla.Integer, primary_key=True)
    name = sqla.Column(sqla.String)
    friction = sqla.Column(sqla.Float)