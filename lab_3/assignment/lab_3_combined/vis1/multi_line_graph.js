var margin = { top: 10, right: 30, bottom: 30, left: 60 };

var createSvg = function (width, height) {
    return d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
};

var ageData = d3.csvParse(ageDataText);
var newAgeData = d3.csvParse(newAgeDataText);


var drawMultiLineGraph = function (width, height, data) {
    var svg = createSvg(width, height);
    var widthMinusMargins = width - margin.left - margin.right;
    var heightMinusMargins = height - margin.top - margin.bottom;

    var sumstat = d3.nest()
        .key(function (d) { return d.name; })
        .entries(data);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.year; }))
        .range([0, widthMinusMargins]);
    svg.append("g")
        .attr("transform", "translate(0," + heightMinusMargins + ")")
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.n; })])
        .range([heightMinusMargins, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette
    var res = sumstat.map(function (d) { return d.key }) // list of group names
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.year); })
                .y(function (d) { return y(+d.n); })
                (d.values)
        })

};