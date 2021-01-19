//setting dimensions and margins
var margin3 = {top: 10, right: 30, bottom: 20, left: 60},
width3 = 400 - margin3.left - margin3.right,
height3 = 150 - margin3.top - margin3.bottom;

//appending svg object to body
var svg3 = d3.select("#horizontal_bar_chart3")
.append("svg")
.attr("width", width3+ margin3.left + margin3.right)
.attr("height", height3 + margin3.top + margin3.bottom)
.append("g")
.attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

//setting background color (ggplot2 styling)
svg3
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height3)
.attr("width", width3 + 10)
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset3 = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/scores2.csv",function(error,data){
  if (error) {
    throw error;
  }

//extracting subgroups
var subgroups = data.columns.slice(1)

//extracting groups
var groups = d3.map(data, function(d){return(d.class)}).keys()

//defining color palette (DDX Default)
var colors = ["#4F82BF","#9CAEC2"]

//defining color scale
var color = d3.scaleOrdinal()
.domain(subgroups)
.range(colors)

//defining linear scale for x axis
var xScale3 = d3.scaleLinear().range([0, width3]);

//defining discrete band scale for y axis
var yScale3 = d3.scaleBand().range([height3, 0]).padding(0.25)

//providing domain values to x and y scales
xScale3.domain([0, 100]);
yScale3.domain(data.map(function(d){ return d.class; }));

//adding x axis
svg3.append("g")
  .attr("transform", "translate(0," + height3 + ")")
  .call(d3.axisBottom(xScale3).tickSize(-height3*1.3).ticks())
  .select('.domain').remove();

//adding y axis
svg3.append("g")
  .call(d3.axisLeft(yScale3).tickSize(-width3*1.3).ticks())
  .select('.domain').remove();

//plotting background customization (ggplot2 styling)
svg3.selectAll('.tick line').attr('stroke','white')

//defining tooltip
var Tooltip = d3.select("#horizontal_bar_chart3")
.append('div')
.style("opacity", 0.9)
.attr("class", "tooltip")
.style("background-color", '#EBEBEB')
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "2px")
.style("padding", "2px")
.style("position", "absolute")

//defining mouseover, mousemove and mouseout functions
  var mouseover = function(d) {
    Tooltip.
    style("opacity",1)
    d3.select(this)
      .style("fill", "#232323")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html(d.class + "</br>" + d.value3)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseout = function(d) {
    Tooltip.
    style("opacity",0)
    d3.select(this)
      .style("fill", function(d) { return color(d.class); })
      .style("opacity", 1)
  }

//adding bars
  svg3.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .on('mouseover',mouseover) //listener for mouseover event
  .on("mousemove",mousemove) //listener for mousemove event
  .on('mouseout',mouseout) //listener for mouseout event
  .attr('width',function(d) {return xScale3(d.value3); })
  .attr('y', function(d) { return yScale3(d.class); })
  .attr("fill", function(d) { return color(d.class); })
  .attr('height', yScale3.bandwidth());
  })
