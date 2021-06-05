# run with:
# set FLASK_APP=server.py
# python -m flask run

from flask import Flask, send_from_directory
app = Flask(__name__)

import csv
import random
reader = csv.reader(open("cereal.csv"))
header = reader.__next__()
stringData = [row for row in reader]

# return a sample of rows
def dataSample(numSamples):
    random.shuffle(stringData)
    return stringData[:numSamples]

# turn list of row text into csv text
def dataToCsvString(header, dataList):
    csvString = ",".join(header) + "\n"
    stringData = [ ",".join([str(x) for x in data]) 
                    for data in dataList ]
    csvString += "\n".join(stringData)

    return csvString

@app.route('/sample/<numSamples>')
def data(numSamples):
    return dataToCsvString(header, dataSample(int(numSamples)))

@app.route('/<path:path>')
def getFile(path):
    return send_from_directory(".", path)