#Author: Nina Oehlckers (s213535)
from vis_db_model import Geometry
import sqlalchemy.orm as orm
from typing import List, Tuple
import datetime
from sqlalchemy import cast


def get_geometry(session: orm.Session) -> List[Geometry]:

    return (
        session.query(Geometry)
        .all()
        )
