#Author: Nina Oehlckers (s213535)
from setuptools import setup

setup(
    name='LiRA-Friction-DB',
    version='0.0.1',
    install_requires=[
        'fastapi',
        'mangum',
        'pandas',
        'psycopg2-binary',
        'pydantic',
        'sqlalchemy',
        'python-dotenv'
    ],
    entry_points={
        'console_scripts': [
            'update_geometry = scripts.update_geometry_table:update_geometry',
            'update_friction = scripts.update_friction_table:update_friction',
            'update_friction_full_workflow = scripts.update_friction_full_workflow:update_friction_full_workflow',
            'remove_wayid_outliers = scripts.remove_wayid_outliers:remove_wayid_outliers'
        ]
    }
)