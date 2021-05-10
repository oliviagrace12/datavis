var agDataLink = "https://raw.githubusercontent.com/oliviagrace12/datavis/5ab15bbe0573a463ba2967fe91984cd05cbdaa3b/lab_3/assignment/lab_3_combined/geovis/us-ag-productivity.csv";
var usStatesDataLink = "https://raw.githubusercontent.com/oliviagrace12/datavis/main/lab_3/assignment/lab_3_combined/geovis/us-states.json";
var usCitiesDataLink = "https://raw.githubusercontent.com/oliviagrace12/datavis/main/lab_3/assignment/lab_3_combined/geovis/us-cities.csv";

var w = 500;
var h = 300;

var projection = d3.geoAlbersUsa().translate([w / 2, h / 2]).scale([2000]);
var path = d3.geoPath().projection(projection);

var colorRange = ['rgb(237,248,251)', 'rgb(178,226,226)', 'rgb(102,194,164)', 'rgb(44,162,95)', 'rgb(0,109,44)'];
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
            d3.csv(usCitiesDataLink, (data) => {
                addCitiesToSvg(data);
                createPanButtons();
            });
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

var addCitiesToSvg = function (data) {
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => { return projection([d.lon, d.lat])[0] })
        .attr("cy", (d) => { return projection([d.lon, d.lat])[1] })
        .attr("r", (d) => { return Math.sqrt(parseInt(d.population) * 0.00004) })
        .style("fill", "yellow")
        .style("stroke", "grey")
        .style("stroke-width", 0.25)
        .style("opacity", 0.75);
}

var createPanButtons = function () {
    var north = createNorthPanButton();
    var south = createSouthPanButton();
    var west = createWestPanButton();
    var east = createEastPanButton();

    d3.selectAll(".pan")
        .on("click", function () {
            var offset = projection.translate();
            var moveAmountPerClick = 50;
            var direction = d3.select(this).attr("id");

            switch (direction) {
                case "north":
                    offset[1] += moveAmountPerClick;
                    break;
                case "south":
                    offset[1] -= moveAmountPerClick;
                    break;
                case "west":
                    offset[0] += moveAmountPerClick;
                    break;
                case "east":
                    offset[0] -= moveAmountPerClick;
                    break;
                default:
                    break;
            }

            projection.translate(offset);

            svg.selectAll("path").attr("d", path);

            svg.selectAll("circle")
                .attr("cx", (d) => { return projection([d.lon, d.lat])[0] })
                .attr("cy", (d) => { return projection([d.lon, d.lat])[1] });
        });
};

var createNorthPanButton = function () {
    var north = svg.append("g")
        .attr("class", "pan")
        .attr("id", "north");

    north.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", 30);

    north.append("text")
        .attr("x", w / 2)
        .attr("y", 20)
        .html("&uarr;");

    return north;
}

var createSouthPanButton = function () {
    var south = svg.append("g")
        .attr("class", "pan")
        .attr("id", "south");

    south.append("rect")
        .attr("x", 0)
        .attr("y", h - 30)
        .attr("width", w)
        .attr("height", 30);

    south.append("text")
        .attr("x", w / 2)
        .attr("y", h - 10)
        .html("&darr;");

    return south;
}

var createWestPanButton = function () {
    var west = svg.append("g")
        .attr("class", "pan")
        .attr("id", "west");

    west.append("rect")
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", 30)
        .attr("height", h - 60);

    west.append("text")
        .attr("x", 15)
        .attr("y", h / 2)
        .html("&larr;");

    return west;
}

var createEastPanButton = function () {
    var east = svg.append("g")
        .attr("class", "pan")
        .attr("id", "east");

    east.append("rect")
        .attr("x", w - 30)
        .attr("y", 30)
        .attr("width", 30)
        .attr("height", h - 60);

    east.append("text")
        .attr("x", w - 15)
        .attr("y", h / 2)
        .html("&rarr;");

    return east;
}