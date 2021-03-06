
var width = 800;
var height = 150;
var barPadding = 10;

var dataset = [];
for (var i = 0; i < 15; i++) {
    dataset.push([i, Math.floor(Math.random() * 100)]);
}

//Bar Chart
var svgBar = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

var bars = svgBar.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect").attr("x", (d, i) => { return i * (width / dataset.length) })
    .attr("y", (d) => { return height - d[1] })
    .attr("width", width / dataset.length - barPadding)
    .attr("height", (d) => { return d[1] })
    .attr("class", "bar");

var barText = svgBar.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((d) => { return d[1] })
    .attr("x", (d, i) => { return i * (width / dataset.length) + (((width / dataset.length) - barPadding) / 2) })
    .attr("y", (d) => { return height - d[1] - 2 })
    .attr("class", "label");



// Line Graph 
var svgLine = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

for (var i = 0; i < dataset.length - 1; i++) {
    svgLine.append("line")
        .attr("x1", dataset[i][0] * (width / dataset.length) + 10)
        .attr("y1", height - dataset[i][1] - 10)
        .attr("x2", dataset[i + 1][0] * (width / dataset.length) + 10)
        .attr("y2", height - dataset[i + 1][1] - 10)
        .attr("class", "axis");
}

svgLine.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => { return i * (width / dataset.length) + 10 })
    .attr("cy", (d) => { return height - d[1] - 10 })
    .attr("r", 4)
    .attr("class", "circle");

svgLine.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((d) => { return "(" + d[0] + ", " + d[1] + ")" })
    .attr("x", (d, i) => { return i * (width / dataset.length) + (((width / dataset.length) - barPadding) / 2) })
    .attr("y", (d) => { return height - d[1] - 18 })
    .attr("class", "label");


// Scatter Plot     
var svgScatter = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

var circles = svgScatter.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => { return i * (width / dataset.length) + 10 })
    .attr("cy", (d) => { return height - d[1] - 10 })
    .attr("r", 4)
    .attr("class", "circle");

var scatterText = svgScatter.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((d) => { return "(" + d[0] + ", " + d[1] + ")" })
    .attr("x", (d, i) => { return i * (width / dataset.length) + (((width / dataset.length) - barPadding) / 2) })
    .attr("y", (d) => { return height - d[1] - 18 })
    .attr("class", "label");
