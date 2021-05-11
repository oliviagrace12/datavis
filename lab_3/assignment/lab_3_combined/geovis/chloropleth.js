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

var zooming = function (d) {
    var offset = [d3.event.transform.x, d3.event.transform.y];
    var newScale = d3.event.transform.k * 2000;

    projection
        .translate(offset)
        .scale(newScale);

    svg.selectAll("path").attr("d", path);

    svg.selectAll("circle")
        .attr("cx", (d) => { return projection([d.lon, d.lat])[0] })
        .attr("cy", (d) => { return projection([d.lon, d.lat])[1] });
}

var zoom = d3.zoom()
    .scaleExtent([0.2, 2.0])
    .translateExtent([[-1200, -700], [1200, 700]])
    .on("zoom", zooming);

var center = projection([-107.0, 42.]);

var map = svg.append("g")
    .attr("id", "map")
    .call(zoom)
    .call(
        zoom.transform,
        d3.zoomIdentity
            .translate(w / 2, h / 2)
            .scale(0.25)
            .translate(-center[0], -center[1])
    );

var drawCloropleth = function () {
    drawBackgroundForZooming();

    d3.csv(agDataLink, (data) => {
        createColorDomain(data);
        d3.json(usStatesDataLink, (json) => {
            mergeMapAndData(data, json);
            addMapAndDataToSvg(json);
            d3.csv(usCitiesDataLink, (data) => {
                addCitiesToSvg(data);
                createPanButtons();
                createZoomButtons();
            });
        });
    });
}

var drawBackgroundForZooming = function () {
    map.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h)
        .attr("opacity", 0);
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
    map.selectAll("path")
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
    map.selectAll("circle")
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
            var moveAmountPerClick = 100;
            var direction = d3.select(this).attr("id");

            var x = 0;
            var y = 0;

            switch (direction) {
                case "north":
                    y += moveAmountPerClick;
                    break;
                case "south":
                    y -= moveAmountPerClick;
                    break;
                case "west":
                    x += moveAmountPerClick;
                    break;
                case "east":
                    x -= moveAmountPerClick;
                    break;
                default:
                    break;
            }

            map.transition().call(zoom.translateBy, x, y);
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

var createZoomButtons = function () {
    var zoomIn = svg.append("g")
        .attr("class", "zoom")
        .attr("id", "zoomIn");

    zoomIn.append("rect")
        .attr("x", w - 65)
        .attr("y", h - 65)
        .attr("width", 30)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5);

    zoomIn.append("text")
        .attr("x", w - 51)
        .attr("y", h - 46)
        .html("+");

    var zoomOut = svg.append("g")
        .attr("class", "zoom")
        .attr("id", "zoomOut");

    zoomOut.append("rect")
        .attr("x", w - 97)
        .attr("y", h - 65)
        .attr("width", 30)
        .attr("height", 30)
        .attr("rx", 5)
        .attr("ry", 5);

    zoomOut.append("text")
        .attr("x", w - 82)
        .attr("y", h - 46)
        .html("-");

    d3.selectAll(".zoom")
        .on("click", function () {
            var moveAmountPerClick = 100;
            var zoomDirection = d3.select(this).attr("id");

            var scaleFactor = 0;

            switch (zoomDirection) {
                case "zoomIn":
                    scaleFactor = 1.5;
                    break;
                case "zoomOut":
                    scaleFactor = 0.75;
                    break;
                default:
                    break;
            }

            map.transition().call(zoom.scaleBy, scaleFactor);
        });
}