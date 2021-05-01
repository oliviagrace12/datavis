var margin = { top: 30, right: 30, bottom: 30, left: 30 };

var data1 = d3.csvParse(heatmapDataText1);
var data2 = d3.csvParse(heatmapDataText2);

var drawHeatmap = function (width, height, inputData) {

    // append the svg object to the body of the page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Labels of row and columns
    var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width - margin.left - margin.right])
        .domain(myGroups)
        .padding(0.01);

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
        .call(d3.axisBottom(x));

    // Build X scales and axis:
    var y = d3.scaleBand()
        .range([height - margin.top - margin.bottom, 0])
        .domain(myVars)
        .padding(0.01);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Build color scale 
    var myColor = d3.scaleLinear()
        .range(["white", "#69b3a2"])
        .domain([1, 100]);

    //Read the data
    

    svg.selectAll()
        .data(inputData, function (d) { return d.group + ':' + d.variable; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.group) })
        .attr("y", function (d) { return y(d.variable) })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return myColor(d.value) });

}