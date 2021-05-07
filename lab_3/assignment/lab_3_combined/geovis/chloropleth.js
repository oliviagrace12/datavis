﻿var processData = function (d) { d3.map().set(d.code, +d.pop) };

var drawChloro = function (svg, populationDataText) {
    var width = +svg.attr("width");
    var height = +svg.attr("height");

    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2, height / 2]);

    // Data and color scale
    var data = d3.map();
    var colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);

    var populationData = d3.csvParse(populationDataText);
    

    // Load external data and boot
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
        .defer(processData, populationData)
        .await(ready);

    //d3.csvParse(populationData, (d) => { data.set(d.code, +d.pop) });

    function ready(error, topo) {

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.id) || 0;
                return colorScale(d.total);
            });
    }
};