from app import form
from app import config
import os
from flask import Flask


class Config(object):
    SECRET_KEY = (
        b'password'
    )


from app import app
