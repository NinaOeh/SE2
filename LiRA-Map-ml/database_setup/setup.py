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
            'update_database = scripts.update_database:update_database',
            'test_query = scripts.test_query:test_query',
        ]
    }
)