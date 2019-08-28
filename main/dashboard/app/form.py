import wtforms
from flask_wtf import FlaskForm as Form
from wtforms import StringField
from wtforms.validators import DataRequired, Length



class stock_choices(Form):
    stock_1 = StringField("Stock 1", validators=[DataRequired(), Length(min=1, max=30)])
    stock_2 = StringField("Stock 2")
    stock_3 = StringField("Stock 3")
