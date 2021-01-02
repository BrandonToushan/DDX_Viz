//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 20, left: 60},
width = 400 - margin.left - margin.right,
height = 150 - margin.top - margin.bottom;

//appending svg object to body
var svg1 = d3.select("#horizontal_bar_chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//setting background color (ggplot2 styling)
svg1
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height)
.attr("width", width +10 )
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset1 = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/scores2.csv",function(error,data){
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
var xScale1 = d3.scaleLinear().range([0, width]);

//defining discrete band scale for y axis
var yScale1 = d3.scaleBand().range([height, 0]).padding(0.25)

//providing domain values to x and y scales
xScale1.domain([0, 100]);
yScale1.domain(data.map(function(d){ return d.class; }));

//adding x axis
svg1.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale1).tickSize(-height*1.3).ticks())
  .select('.domain').remove();

//adding y axis
svg1.append("g")
  .call(d3.axisLeft(yScale1).tickSize(-width*1.3).ticks())
  .select('.domain').remove();

//plotting background customization (ggplot2 styling)
svg1.selectAll('.tick line').attr('stroke','white')

//defining tooltip
var Tooltip = d3.select("#horizontal_bar_chart")
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
      .style("right", (d3.mouse(this)[0]+70) + "px")
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
  svg1.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .on('mouseover',mouseover) //listener for mouseover event
  .on("mousemove",mousemove) //listener for mousemove event
  .on('mouseout',mouseout) //listener for mouseout event
  .attr('width',function(d) {return xScale1(d.value); })
  .attr('y', function(d) { return yScale1(d.class); })
  .attr("fill", function(d) { return color(d.class); })
  .attr('height', yScale1.bandwidth());
  })
