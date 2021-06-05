class StackedBarGraphVis {

    constructor() {
        this.SbDispatch = d3.dispatch("clicked");
    }

    drawStackedBarGraph(subgroups, groups, stackedData) {
        var margin = { top: 10, right: 30, bottom: 20, left: 50 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        var svg = d3.select("body")
            .append("svg")
            .attr("width", 460)
            .attr("height", 460)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var dispatch = this.SbDispatch;


        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        var y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return color(d.key); })
            .on("click", function (d) {
                dispatch.call("clicked", {}, d.key);
            })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.group); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth());
    }
}