var agDataLink = "https://raw.githubusercontent.com/oliviagrace12/datavis/5ab15bbe0573a463ba2967fe91984cd05cbdaa3b/lab_3/assignment/lab_3_combined/geovis/us-ag-productivity.csv";
var usStatesDataLink = "https://raw.githubusercontent.com/oliviagrace12/datavis/main/lab_3/assignment/lab_3_combined/geovis/us-states.json";

var w = 500;
var h = 300;

var projection = d3.geoAlbersUsa().translate([w / 2, h / 2]).scale([500]);
var path = d3.geoPath().projection(projection);

var colorRange = ['rgb(254,237,222)', 'rgb(253,190,133)', 'rgb(253,141,60)', 'rgb(230,85,13)', 'rgb(166,54,3)'];
var color = d3.scaleQuantize().range(colorRange);

var svg = d3.select("body")
    .append("svg")
    .attr("width", w).
    attr("height", h);

var drawCloropleth = function () {
    d3.csv(agDataLink, (data) => {
        createColorDomain(data);
        d3.json(usStatesDataLink, (json) => {
            mergeMapAndData(data, json);
            addMapAndDataToSvg(json);
        });
    });
}

var createColorDomain = function (data) {
    color.domain([
        d3.min(data, (d) => { return d.value }),
        d3.max(data, (d) => { return d.value })
    ])
}

var mergeMapAndData = function (data, json) {
    for (var i = 0; i < data.length; i++) {
        var dataState = data[i].state;
        var dataValue = parseFloat(data[i].value);
        var jsonState = findJsonState(dataState, json);

        jsonState.properties.value = dataValue;
    }
}

var findJsonState = function (dataState, json) {
    for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;
        if (dataState == jsonState) {
            return json.features[j];
        }
    }
}

var addMapAndDataToSvg = function (json) {
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", (d) => {
            var value = d.properties.value;
            if (value) {
                return color(value);
            } else {
                return "#ccc";
            }
        });
}