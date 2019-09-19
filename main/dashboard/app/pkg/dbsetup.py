"""
import pymysql.cursors
import pandas as pd


try:
    from .import dbconfig as config
except ImportError:
    import dbconfig as config
"""


from mysql.connector import (connect)


class Connection:
    """
    Setting up connection.

    """
    config_mysql = {
        # Credentials
        "user": "root",
        "password": "Tamamasheer0",

        # Connection
        "host": "127.0.0.1",
        "port": 3306,
        "connection_timeout": 10,

        # Database
        "database": "stock_data",
        "charset": "utf8mb4",
        "autocommit": True,
        "use_pure": False,
    }

    def __init__(self, db='stock_data'):
        self.host_name = config.host_name
        self.user_name = config.user_name
        self.password = config.password

    def make_connection(self, **config_mysql):
        """
        Makes a pymysql connection to the database

        """
        if not db:
            db = self.db
        try:
            connection = pymysql.connect(
                host=self.host_name,
                user=self.user_name,
                password=self.password,
                db=db,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor)

            return connection

        except Exception as e:
            raise (e)

    def close_connection(self):
        '''
        reports should close on their own
        '''
        with self.connection as conn:
            conn.close()
