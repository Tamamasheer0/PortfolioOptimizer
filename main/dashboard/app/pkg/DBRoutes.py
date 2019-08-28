"""
    Flask Routes - Portfolio Optimization Dashboard
    Created On: 08/24/2019              Last Modifed: 08/27/2019

    Included Functions:
    -   Construct ChartJS Config Variable
    -   Portfolio Optimization Simulation Functions
"""
import pandas as pd
import numpy as np
import quandl as ql
import random

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session


#from apiconfig import quandl_api_key
quandl_api_key = "oaVsrcUmaesTBfV8xxgi"


def quandl_stock_data(symbol, verbose=False):
    # <Define> DataFrame Column Headers
    headers = [
        'Open',
        'High',
        'Low',
        'Close',
        'Volume',
    ]

    # <Set> API Query Parameters
    query_params = {
        'symbol': symbol.upper(),
        'start_date': "2014-01-01",
        "end_date": "2019-01-01",
        "collapse": "monthly",
        "data_type": "pandas",    # [numpy | pandas ] Array vs DataFrame
    }

    try:
        stock_returns = ql.get(
            f"WIKI/{query_params['symbol']}",
            start_date=query_params['start_date'],
            end_date=query_params['end_date'],
            colapse=query_params['collapse'],
            returns=query_params['data_type'],
            authtoken=quandl_api_key
        )[headers]

        if verbose:
            print(f"\n[Quandl] Query API Summary:\n")
            print("-" * 75, "\n")
            for param, val in query_params.items():
                print(f"- {param}:", val)

            print("\n", ("-" * 75), "\n")
            print("\n[Preview] Response DataFrame\n")
            print("\n", stock_returns.head(10), "\n")
            print("-" * 75, "\n")
            print("\n[View] DataFrame Columns -- Data Uniformity\n")
            print(stock_returns.count(), "\n")
            print("-" * 75, "\n")
            print("\n[View] DataFrame Columns -- Data Types\n")
            print(stock_returns.dtypes, "\n")

        return stock_returns

    except ql.NotFoundError:
        print(f"\n[Error | API Query] Invalid Company Symbol: {query_params['symbol']}")
        return None


'''#########################################################################
    Function: Select Optimial Portfolio Weights

        Req:
            Fn: Simulate Portfolios (Monte Carlo Simulation)

#########################################################################'''
# Portfolio Optimization Function


def api_simulate_portfolios(assets, simulations=1000):
    num_assets = len(assets)
    portfolio = closing_prices(assets[0])
    print(f'[{0}] Retrieving Stock Data: {assets[0].upper()}')

    try:
        for i, asset in enumerate(assets[1:]):
            print(f'[{i + 1}] Retrieving Stock Data: {asset}')
            add_stock = closing_prices(asset)
            portfolio = pd.merge(portfolio, add_stock, on="Date", how="inner")
            del add_stock

        portfolio.set_index("Date", inplace=True)

        print(f'\nOptimizing Portfolio Weights >> Simulations: x {simulations}')

        # Monte Carlo Simulation
        portfolio_log = []
        portfolio_sim = {}
        for i in range(simulations):
            weights = np.random.random(num_assets)
            weights /= np.sum(weights)
            WTSp = zip(assets, weights)
            RTNp = exp_portfolio_return(portfolio, weights)
            VARp = exp_portfolio_variance(portfolio, weights)

            portfolio_sim = {a: round(wt, 4) for a, wt in WTSp}
            portfolio_sim["Return"] = RTNp
            portfolio_sim["Variance"] = VARp
            portfolio_sim["Sharpe"] = mod_sharpe_ratio(RTNp, VARp)
            portfolio_log.append(portfolio_sim)

        return pd.DataFrame(portfolio_log)

    except ConnectionError as c:
        print("\n\tError> Quandl API Key Expired (Likely)\n")
        return None


#   [Original Function] All-In-One >> Same as Split
def optimize_portfolio(assets, simulations=5000):
    num_assets = len(assets)
    portfolio = closing_prices(assets[0])
    print(f'[{0}] Retrieving Stock Data: {assets[0].upper()}')

    for i, asset in enumerate(assets[1:]):
        print(f'[{i + 1}] Retrieving Stock Data: {asset}')
        add_stock = closing_prices(asset)
        portfolio = pd.merge(portfolio, add_stock, on="Date", how="inner")
        del add_stock

    portfolio.set_index("Date", inplace=True)

    print(f'\nOptimizing Portfolio Weights >> Simulations: x {simulations}')

    # Monte Carlo Simulation
    portfolio_log = []
    portfolio_sim = {}
    for i in range(simulations):
        weights = np.random.random(num_assets)
        weights /= np.sum(weights)
        WTSp = zip(assets, weights)
        RTNp = exp_portfolio_return(portfolio, weights)
        VARp = exp_portfolio_variance(portfolio, weights)

        portfolio_sim = {a: round(wt, 4) for a, wt in WTSp}
        portfolio_sim["Return"] = RTNp
        portfolio_sim["Variance"] = VARp
        portfolio_sim["Sharpe"] = mod_sharpe_ratio(RTNp, VARp)
        portfolio_log.append(portfolio_sim)

    log_df = pd.DataFrame(portfolio_log)
    ranked_df = log_df.sort_values("Sharpe", ascending=False)

    print(f'\nOptimized Portfolio Weights:')
    print(ranked_df.iloc[0])
    return dict(ranked_df.iloc[0])


def simulate_portfolios(portfolio, simulations=1000):
    if type(portfolio) is pd.core.frame.DataFrame:
        print(f'\nSimulating Portfolios... x {simulations}\n\n', flush=True)
        print(portfolio.head(15), flush=True)
        # Monte Carlo Simulation
        assets = list(portfolio.columns)
        num_assets = len(assets)
        portfolio_log = []
        portfolio_sim = {}
        for i in range(simulations):
            weights = np.random.random(num_assets)
            weights /= np.sum(weights)
            WTSp = zip(assets, weights)
            RTNp = exp_portfolio_return(portfolio, weights)
            VARp = exp_portfolio_variance(portfolio, weights)

            portfolio_sim = {a: round(wt, 4) for a, wt in WTSp}
            portfolio_sim["Return"] = RTNp
            portfolio_sim["Variance"] = VARp
            portfolio_sim["Sharpe"] = mod_sharpe_ratio(RTNp, VARp)
            portfolio_log.append(portfolio_sim)

        return portfolio_log


# Portfolio Performance Back-Testing Function


def backtest_portfolio(pfolio):
    exclude = ["Return", "Sharpe", "Variance"]
    assets = [(a, wt) for a, wt in pfolio.items() if a not in exclude]

    # Initialize Portfolio Back-Test Performance DataFrame
    back_test = closing_prices(assets[0][0]).set_index("Date")
    back_test = np.log(back_test / back_test.shift(1)).iloc[1:]
    back_test = back_test.apply(lambda x: x * assets[0][1])
    print(f'\nTicker: {assets[0][0]} \tPortfolio Weight: {assets[0][1]}')
    print(back_test.head())

    for allocation in assets[1:]:
        stock = allocation[0]
        weight = allocation[1]
        print(f'\nTicker: {stock} \tPortfolio Weight: {weight}')

        closing_data = closing_prices(stock).set_index("Date")
        pct_return = np.log(closing_data / closing_data.shift(1)).iloc[1:]
        pct_return = pct_return.apply(lambda x: x * weight)
        back_test = pd.merge(back_test, pct_return, on="Date", how="inner")
        print(pct_return.head())

    back_test["RTNp"] = back_test.sum(axis=1)
    print("\n[Historic] Portfolio Performance:\n", back_test.head())

    return back_test


# Portfolio Performance Evaluation Function


def evaluate_portfolio(rtns):
    RTNm = pd.read_csv("S&P500.csv")[["Date", "Close"]]
    RTNm["Date"] = pd.to_datetime(RTNm["Date"])
    RTNm = RTNm.rename(columns={"Close": "RTNm"}).set_index("Date")
    RTNm = np.log(RTNm / RTNm.shift(1)).iloc[1:]

    rtns = pd.merge(rtns, RTNm, on="Date", how="inner")
    rtns["Excess"] = rtns["RTNp"] - rtns["RTNm"]
    rtns["Compare"] = rtns["Excess"] > 0
    rtns["Compare"] = rtns["Compare"].apply(lambda x: "Outperform" if x else "Underperform")
    print(rtns.head())

    return rtns


def generate_random_portfolio():
    #stocklist_df = pd.read_csv("StockTickers.csv")
    #stocklist = list(dict(stocklist_df)["Tickers"])
    stocklist = "TXN,TSLA,DIS,CVX,AMZN,KO,CMCSA,WFC,PG,JPM,MSFT,BAC,C".split(",")

    random_portfolio = []
    while len(random_portfolio) != 3:
        add_stock = random.choice(stocklist)
        if add_stock not in random_portfolio:
            random_portfolio.append(add_stock)
            del add_stock

    print("\nRandom Generated Portfolio", random_portfolio)
    return random_portfolio

#   Compile Random Portfolio Data -- Pull Historic Data & Aggregate to DataFrame


def compile_random_portfolio(p_stocks):
    print(f"\n<Quandl API> Stock Data: {p_stocks[0]}")
    sim_portfolio = closing_prices(p_stocks[0])
    for stock in p_stocks[1:]:
        print(f"<Quandl API> Stock Data: {stock}")
        add_stock = closing_prices(stock)
        sim_portfolio = pd.merge(sim_portfolio, add_stock, on="Date", how="inner")
        del add_stock

    benchmark = pd.read_csv("S&P500.csv")[["Date", "Close"]]
    benchmark["Date"] = pd.to_datetime(benchmark["Date"])
    benchmark = benchmark.rename(columns={"Close": "SP500"})

    output_portfolio = pd.merge(sim_portfolio, benchmark, on="Date", how="inner")

    print("\n[Output] Portfolio Closing Prices\n", output_portfolio.head())
    return output_portfolio.set_index("Date")

#   Portfolio Descriptive Statistics Calculation Function


def generate_ml_training_data(sim_portfolio):
    p_stocks = list(sim_portfolio.columns)
    p_stocks.remove("SP500")
    benchmark_portfolio = sim_portfolio["SP500"]
    stock_portfolio = sim_portfolio[p_stocks]

    print('\n[Training] Stock Portfolio\n', stock_portfolio.head())

    weights = np.random.random(len(p_stocks))
    weights /= np.sum(weights)

    p_allocation = [(pos[0], round(pos[1], 4)) for pos in zip(p_stocks, weights)]
    print("\n[Portfolio] Asset Allocation:\n", p_allocation)

    pct_returns = round(stock_portfolio.pct_change().iloc[1:], 4)
    pct_returns["RTNp"] = np.sum(pct_returns, axis=1)
    print("\n[Portfolio] Daily Returns:")
    print(pct_returns.head())

    # Calculate Portfolio Statistics (Return, Variance, Sharpe)
    p_rtn = exp_portfolio_return(stock_portfolio, weights)
    p_var = exp_portfolio_variance(stock_portfolio, weights)

    mod_sharpe = mod_sharpe_ratio(p_rtn, p_var)

    unweighted_perform = round((stock_portfolio.iloc[-1] / stock_portfolio.iloc[0]) - 1, 4)
    print("\n[Portfolio] Unweighted Returns")
    print(unweighted_perform.head())

    weighted_perform = round(np.sum(unweighted_perform[p_stocks] * weights), 4)
    print(f"\n[Portfolio] Weighted Return: {weighted_perform}")

    benchmark_perform = round((benchmark_portfolio[-1] / benchmark_portfolio[0]) - 1, 4)

    # Portfolio Regression Beta Calculation
    p_beta = "N/A"
    print(f"\n[Benchmark | S&P500] Perfomance: {benchmark_perform}")

    # Need to Validate This Risk Adjusted Calculation
    pfolio_radj_perform = ((weighted_perform / p_var) > (benchmark_perform / benchmark_perform.var()))
    pfolio_stats = {
        "CTp": len(p_stocks),
        "RTNp": round(p_rtn, 4),
        "VARp": round(p_var, 4),
        "SHRp": round(mod_sharpe, 4),
        "BETAp": p_beta,
        "SP500": round(benchmark_perform, 4),
        "PvSP": pfolio_radj_perform
    }

    return pfolio_stats

# Helper Functions - Optimize Portfolio, Backtest Portfolio Performance


def closing_prices(stock):
    price_data = quandl_stock_data(stock) \
        .rename(columns={"Close": stock.upper()})[stock.upper()] \
        .reset_index()
    return price_data


def stock_std_cumulative_performance(ticker, verbose=True):
    eod_close = closing_prices(stock=ticker).set_index("Date")
    eod_close["std_close"] = round(eod_close[ticker] / eod_close[ticker].iloc[0], 4) - 1
    if verbose:
        print(eod_close.head())
    return eod_close


def portfolio_std_cumulative_performance(daily_returns, verbose=True):
    if type(daily_returns) is pd.coreseries.Series:
        portfolio_start_value = 1
        eod_portfolio_values = [(0, portfolio_start_value)]

        for d, pct_return in daily_returns.items():
            daily_open_value = eod_portfolio_values[-1][1]
            daily_close_value = round(daily_open_value * (1 + pct_return), 6)
            eod_portfolio_value.append((d, daily_close_value))
            if verbose:
                print(f'date: {d},\t'
                      f'open: {daily_open_value},\t'
                      f'%rtn: {round(pct_return, 6)}\t'
                      f'close: {daily_close_value}')

        portfolio_mkt_values = pd.DataFrame(
            eod_portfolio_values[1:],
            columns=["Date", "Mkt_Value"]
        ).set_index("Date")
        portfolio_mkt_values["std_close"] = portfolio_mkt_values["Mkt_Val"].apply(lambda x: x - 1)
        return portfolio_mkt_values

    else:
        print("<Error> Incorrect Data Type: Req. Pandas Series")
        return None


def exp_portfolio_return(portfolio, weights):
    log_returns = np.log(portfolio / portfolio.shift(1)).iloc[1:]
    return round(np.sum(weights * log_returns.mean()) * 250, 4)


def exp_portfolio_variance(portfolio, weights):
    log_returns = np.log(portfolio / portfolio.shift(1)).iloc[1:]
    return round(np.sqrt(np.dot(weights.T, np.dot(log_returns.cov() * 250, weights))), 4)


def mod_sharpe_ratio(ERp, EVARp):
    mkt_return = .098
    return round((ERp - mkt_return) / EVARp, 4)


# engine = create_engine(connect, echo=True)
# Base = automap_base()
# Base.prepare(engine, reflect=True)
# session = Session(bind=True)
# sql_qry = f'SELECT Date, AMZN, JPM \
#             FROM stock_data.closing_prices;'

# retval = engine.execute(sql_qry).fetchall()
# print(pd.DataFrame(retval))


'''##############################################################
    <Ben> Portfolio Optimizer (Scatter Chart Data)
    Chart: Efficient Frontier
    Type: Scatter Plot
    Data Structure: Array
    Req: {'x' & 'y'} Coordinate Pairings
###############################################################'''


def efficient_frontier_data(stock_list, db):
    print(f'\nGenerating Efficient Frontier Portfolios...\n', flush=True)
    engine = create_engine(db, echo=True)
    base = automap_base()
    base.prepare(engine, reflect=True)
    session = Session(bind=engine)

    stock_list.insert(0, "Date")
    qry_stocks = ",".join(stock_list)
    print(f"Stock List: {qry_stocks}", flush=True)
    sql_query = f'SELECT {qry_stocks} \
                  FROM stock_data.closing_prices'

    print(f"SQL Query: \n{sql_query}\n\n", flush=True)

    qry_return = engine.execute(sql_query).fetchall()

    # Print to Terminal
    for i, row in enumerate(qry_return):
        if (i % 10) == 0:
            print(i, row)

    print(stock_list, flush=True)

    stocks_df = pd.DataFrame(qry_return)
    stocks_df.columns = stock_list
    stocks_df.set_index("Date", inplace=True)
    stocks_df = stocks_df.astype(float)
    print(stocks_df.head(15), flush=True)

    sim_portfolios = simulate_portfolios(stocks_df)

    scatter_data = []
    for pfolio in sim_portfolios:
        grouped = {
            "x": pfolio["Variance"],
            "y": pfolio["Return"]
        }
        scatter_data.append(grouped)
    ef_data = {"EF": scatter_data}
    return ef_data


# assets = "JPM,MSFT,DIS".split(",")
# print("Stock Picks: ", assets, flush=True)
# json_data = efficient_frontier_data(stock_list=assets, mysql_conn=connect)
# print(json_data)
