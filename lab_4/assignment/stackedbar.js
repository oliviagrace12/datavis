class StackedBarGraphVis {

    constructor() {
        this.SbDispatch = d3.dispatch("clicked");
    }

    drawLineGraph() {
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

        d3.csv("https://raw.githubusercontent.com/oliviagrace12/datavis/main/lab_4/assignment/fruit_data.csv", function (data) {

            // List of subgroups = header of the csv files = soil condition here (Nitrogen, normal, stress)
            var subgroups = data.columns.slice(1)

            // List of groups = species here = value of the first column called group -> I show them on the X axis
            var groups = d3.map(data, function (d) { return (d.group) }).keys()

            // Add X axis
            var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, 60])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette = one color per subgroup
            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8', '#4daf4a'])

            //stack the data? --> stack per subgroup
            var stackedData = d3.stack()
                .keys(subgroups)
                (data)

            // Show the bars
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

        })
    }
}