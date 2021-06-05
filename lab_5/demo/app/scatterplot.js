var ScatterplotVis = function(svg, data) {
    var newSP = { 
        ydim: "Protein (g)",
        xdim: "Calories",
        textVar: "Cereal Name",
        colorVar: "Manufacturer",
        svg: svg, // bring variables we need into 'this' scope
        data: data,

        drawScatterplot: function() {
            // get aliases to the names of variables used for plot
            ydim = this.ydim;
            xdim = this.xdim;
            colorVar = this.colorVar;
            textVar = this.textVar;
            data = this.data;

            fullW = +this.svg.attr("width");
            fullH = +this.svg.attr("height");
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = fullW - margin.left - margin.right,
                height = fullH - margin.top - margin.bottom;

            /* 
            * value accessor - returns the value to encode for a given data object.
            * scale - maps value to a visual display encoding, such as a pixel position.
            * map function - maps from data value to display value
            * axis - sets up axis
            */ 

            // setup x 
            var xValue = function(d) { return d[this.xdim];}, // data -> value
                xScale = d3.scaleLinear().range([0, width]), // value -> display
                xMap = function(d) { return xScale(xValue(d));}, // data -> display
                xAxis = d3.axisBottom(xScale);

            // setup y
            var yValue = function(d) { return d[this.ydim];}, // data -> value
                yScale = d3.scaleLinear().range([height, 0]), // value -> display
                yMap = function(d) { return yScale(yValue(d));}, // data -> display
                yAxis = d3.axisLeft(yScale)

            // setup fill color
            var cValue = function(d) { return d[colorVar];},
                color = d3.scaleOrdinal(d3.schemeCategory10)

            // add the graph canvas to the body of the webpage
            this.svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // add the tooltip area to the webpage
            var tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            // don't want dots overlapping axis, so add in buffer to data domain
            xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
            yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

            // x-axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text(this.xdim);

            // y-axis
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(ydim);

            // draw dots
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function(d) { return color(cValue(d));}) 
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d[textVar] + "<br/> (" + xValue(d) 
                        + ", " + yValue(d) + ")")
                        .style("left", (d3.event.pageX + 5) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // draw legend
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            // draw legend text
            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d;})
        },

        reDraw: function() {
            svg.selectAll("*").remove();
            this.drawScatterplot();
        },

        changeXY: function(xdim, ydim) {
            this.xdim = xdim;
            this.ydim = ydim;
            this.reDraw();
        },

        changeTextVar: function(varname) {
            this.textVar = varname;
            this.reDraw();
        },

        changeColorVar: function(varname) {
            this.colorVar = varname;
            this.reDraw();
        },

        updateData: function(data) {
            this.data = data;
            this.reDraw();
        }
     }; // newSP

     // convert data to numerical values
     // this is done in-place to the data for this object
     // for two reasons:
     // (1) 'data' came from the d3 call and is actually a specialized
     // object with string keys like "0" and one called "columns",
     // which makes it awkward to use anything but data.forEach
     // which is a d3 function
     // (2) because JavaScript does not have a convenient way to
     // deep copy an object, the more functional style of creating
     // and modifying a copy is a pain
     // * note this is effectively a private function of this
     //   object because it is not attached to the newSP instance
     // * pardon the lack of comments - we simply walk through the
     //   data items and for each variable, change to numeric with
     //   the + operator when applicable
     function transformDataToNumeric() {
        newSP.data.forEach(function(d) {
            for (key in d) {
                if (!isNaN(+d[key])) {
                    d[key] = +d[key] 
                }
            }
        })
     }

     // when this function runs to create the new object,
     // this code is run
     transformDataToNumeric();

     return newSP;
}
    
