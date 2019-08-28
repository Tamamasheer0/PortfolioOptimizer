"""
    Flask Routes - Portfolio Optimization Dashboard
    Created On: 08/24/2019              Last Modifed: 08/27/2019

    Included Functions:
    -   Construct ChartJS Config Variable
    -   Portfolio Optimization Simulation Functions
"""
import pandas as pd
import numpy as np
from flask import (
    FLASK,
    render_template,
    jsonify
)

from PyFinance import (
    closing_prices,
    optimize_portfolio,
    backtest_portfolio,
    evaluate_portfolio,
    stock_std_cumulative_peformance,
    portfolio_std_cumulative_performance,
)

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

config = {
    'user': 'root',
    'password': 'Tamamasheer0',
    'connect': f'mysql://{config["user"]}:{config["password"]}@localhost/stock_data'
}


'''##############################################################
    <Ben> Portfolio Optimizer (Scatter Chart Data)
    Chart: Efficient Frontier
    Type: Scatter Plot
    Data Structure: Array
    Req: {'x' & 'y'} Coordinate Pairings
###############################################################'''


def generate_efficient_frontier(stock_list):
    #   Need Simulate Portfolio Function
    engine = create_engine(connect, echo=True)
    base = automap_base()
    base.prepare(connect, reflect=True)
    session = Session(bind=engine)

    qry_stocks = ",".join(stock_list)
    sql_query = f'SELECT {stock_list} \
                   FROM stock_data.closing_prices'

    qry_return = engine.execute(sql_query).fetchall()

    stock_list.insert(0, "DATE")
    stocks_df = pd.DataFrame(qry_return)
    stocks_df.columns = stock_list
    stocks_df.set_index("DATE", inplace=True)
    sim_portfolios = simulate_portfolios(query_df)

    trace = {"EF": sim_portfolios}
    return jsonify(trace)
