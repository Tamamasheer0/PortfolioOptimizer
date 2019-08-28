import pandas as pd
from app.pkg.dbsetup import Connection


class Query(Connection):
    """

    """
    def __init__(self, stock_1=None, stock_2=None, stock_3=None):
        super().__init__()
        self.stock_1 = stock_1
        self.stock_2 = stock_2
        self.stock_3 = stock_3
        self.queries = {"Stock 1 Query": self.stock_1_query(),
                        "Stock 2 Query": self.stock_2_query(),
                        "Stock 3 Query": self.stock_3_query()
                        }


    def stock_1_query(self):
        """
        Generates stock_1 closing prices from 2014-2018.
        """
        return f"""
                SELECT Date, '{self.stock_1}'
                FROM closing_prices;"""

    def stock_2_query(self):
        """
        Generates stock_2 closing prices from 2014-2018.
        """
        return f"""
                SELECT '{self.stock_2}'
                FROM closing_prices;"""

    def stock_3_query(self):
        """
        Generates stock_3 closing prices from 2014-2018.
        """
        return f"""
                SELECT '{self.stock_3}'
                FROM closing_prices;"""


    def execute_queries(self):
        self.results = {}
        if self.stock_1:
            self.queries[self.stock_1] = self.stock_1_query()
        if self.stock_2:
            self.queries[self.stock_2] = self.stock_2_query()
        if self.stock_3:
            self.queries[self.stock_3] = self.stock_3_query()

        for name, query in self.queries.items():
            with self.conn.cursor() as cursor:
                try:
                    cursor.execute(query)
                    result = cursor.fetchall()
                    try:
                        self.results[name] = pd.DataFrame(result)
                    except ValueError as e:
                        self.results[name] = pd.DataFrame()
                except pymysql.err.InternalError as e:
                    print(query)
                    self.conn.close()
                    raise e

        self.conn.close()


    def run(self):
        self.conn = self.make_connection()
        self.execute_queries()
        if self.results['Stock 1 Query'].shape[1] < 1:
            self.conn = self.make_connection(db='stock_data')
            self.execute_queries()

        response = self.results
        return response
