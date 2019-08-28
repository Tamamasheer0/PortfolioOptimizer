from app import pkg
from app import form
from app.config import Config
import os
from flask import Flask


app = Flask(__name__)
app.config.from_object(Config)

from app import app
