# run with:
# set FLASK_APP=fruit-server.py
# python -m flask run

from flask import Flask, send_from_directory
app = Flask(__name__)

@app.route('/<path:path>')
def getFile(path):
    return send_from_directory(".", path)