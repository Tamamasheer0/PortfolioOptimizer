# import necessary libraries
import os
import pandas as pd
import pymysql
import random

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

db_config = {
    'user': 'root',
    'password': 'Tamamasheer0',
    'mysql_db': 'localhost/stock_data'
}
mysql_connect = f'mysql://{db_config["user"]}:{db_config["password"]}@{db_config["mysql_db"]}'


from app.pkg import dbsetup, queries
from app.form import stock_choices
from app import app
from app.config import Config

#   Import Custom Flask Routes >> FlaskRoutes.py
from app.pkg.DBRoutes import (
    generate_random_portfolio,
    efficient_frontier_data
)


print("\n\tInitializing Flask App\n\t>> Portfolio Optimization Dashboard\n\n", flush=True)
print(f'\n\tMySQL Database Connection:\n\t>>> {mysql_connect}\n')

app = Flask(__name__)
app.config.from_object(Config)

# Main - Dashbaord Flask Route


@app.route("/")
def home():
  print("\n<Route> Render: Portfolio Dashboard", flush=True)
  return render_template("index.html")


@app.route("/LightMode")
def DashboardLight():
  print("\n<Route> Render: Dashboard - Light")
  return render_template("dashboard-light-2.html")


@app.route("/defChartEF")
def mysql_query_efficient_frontier(db_conn=mysql_connect):
  print(f'\n<Flask Query> Run Query: Efficient Frontier Data\n', flush=True)
  portfolio_assets = generate_random_portfolio()
  query_data = efficient_frontier_data(portfolio_assets, db_conn)
  return jsonify(query_data)


@app.route('/Closing_Prices', methods=['POST', 'GET'])
def closing_prices():
  form = stock_choices()
  if form.validate_on_submit():
    report = queries.Query(stock_1=stock_1, stock_2=stock_2, stock_3=stock_3)
    response = report.run()

    try:
      fp = response[0]
      filename = response[1]
      with open(fp, 'rb') as file:
        returnfile = file.read()
      os.remove(fp)
      return Response(returnfile, mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      headers={"Content-disposition": f"attachment; filename={filename}"})
    except Exception as e:
      return render_template('form.html',
                             form=form,
                             title='Query',
                             report_title=f"report could not be completed"
                             )

  return render_template('form.html',
                         form=form,
                         title='Query',
                         report_title=None
                         )


if __name__ == "__main__":
  app.run(port=5000, debug=True)
