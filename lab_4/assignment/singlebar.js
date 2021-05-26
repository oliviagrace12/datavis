class SingleBarGraphVis {
    drawSingleBarGraph(svg, key, groups, subgroups) {
        svg.selectAll("rect").remove();
        svg.selectAll("text").remove();

        var dataUrl = "https://raw.githubusercontent.com/oliviagrace12/datavis/main/lab_4/assignment/fruit_data.csv";
        d3.csv(dataUrl, function (data) {
            var width = +svg.attr("width");
            var height = +svg.attr("height");
            
            var x = d3.scaleBand()
            .domain(groups)
            .range([40, width-20])
            .padding([0.2])

            var y = d3.scaleLinear()
            .domain([0, 60])
            .range([height, 0]);
            
            var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])

            svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) { 
                return d.group 
            })
            .attr("x", function (d) { return x(d.group); })
            .attr("y", function (d) { 
                switch (key) {
                    case "Nitrogen":
                        return y(d.Nitrogen) - 5; 
                    case "Normal":
                        return y(d.Normal) - 5;
                    case "Stress":
                        return y(d.Stress) - 5;
                } 
            });

            svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.group); })
            .attr("y", function (d) { 
                switch (key) {
                    case "Nitrogen":
                        return y(d.Nitrogen); 
                    case "Normal":
                        return y(d.Normal);
                    case "Stress":
                        return y(d.Stress);
                } 
            })
            .attr("height", function (d) { 
                if (key == "Nitrogen") {
                    return y(0) - y(d.Nitrogen);
                } else if (key == "Normal") {
                    return y(0) - y(d.Normal);
                } else {
                    return y(0) - y(d.Stress);
                } 
            })
            .attr("width", x.bandwidth())
            .attr("fill", function (d) { 
                switch (key) {
                    case "Nitrogen":
                        return '#e41a1c'; 
                    case "Normal":
                        return '#377eb8';
                    case "Stress":
                        return '#4daf4a';
                } 
            });
            
        })
       
    }
}