from flask import Flask, send_from_directory
app = Flask(__name__)

# get the data into memory
# (this could be done in a separate module)
import csv
import random
from sklearn.cluster import KMeans
reader = csv.reader(open("cereal.csv"))
header = reader.__next__()
stringData = [ row for row in reader ]
numericalData = [ [ float(x) for x in row[3:] ] for row in stringData ]

# return a sample set of rows of the cereal data
def dataSample(numSamples):
    random.shuffle(stringData)
    return stringData[:numSamples]

# take a list of data rows and make CSV text
def dataToCSVStr(header, dataList):
    csvStr = ",".join(header) + "\n"
    strData = [ ",".join([str(x) for x in data])
                  for data in dataList ]
    csvStr += "\n".join(strData)

    return csvStr

@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)

@app.route('/sample/<numSamples>')
def data(numSamples):
    return dataToCSVStr(header, dataSample(int(numSamples)))

@app.route('/cluster')
def cluster():
    clusts = KMeans(n_clusters=3).fit_predict(numericalData)
    # add this on the end of the data
    H = header + ["cluster"]
    D = [ stringData[i] + [ clusts[i] ] for i in range(len(stringData)) ]
    return dataToCSVStr(H, D)