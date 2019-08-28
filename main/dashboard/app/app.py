# import necessary libraries
import os
import pandas as pd
import pymysql

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from app.pkg import dbsetup, queries
from app.form import stock_choices
from app import app
from app.config import Config

#   Import Custom Flask Routes >> FlaskRoutes.py
from app.pkg.DBRoutes import *

print("\n\tInitializing Flask App >> Portfolio Optimization Dashboard\n\n", flush=True)


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
