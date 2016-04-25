var width = screen.width,  height = screen.width * (3/4);

var projection = d3.geo.albersUsa()
.scale(width * .9)
.translate([width / 2, height / 3]);

var path = d3.geo.path()
.projection(projection);
var zoom = d3.behavior.zoom()
  .translate([0,0])
  .scale(1)
  .scaleExtent([1,8])
  .on("zoom", zoomed);


var zoomTranslate = [0,0];
var zoomScale = 1;
function zoomed() {
  zoomTranslate = d3.event.translate;
  svg.selectAll("circle").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  zoomScale = d3.event.scale;
  svg.selectAll("path").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  svg.selectAll(".legend").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

}

var svg = d3.select("#usmap")
.attr("width", width)
.attr("height", height)
.attr("class", "col-xs-10")
.call(zoom);

svg.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height);

var g = svg.append("g");

var Keywidth = 10,
    Keyheight = 200;
  var key = d3.select("#colorscale").append("svg")
    .attr("width", Keywidth)
    .attr("height", Keyheight)
    .attr("id", "colorscaleSVG");
    
    var gradient = d3.select("#colorscaleSVG").append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("y1", "0%")
    .attr("x1", "0%")
    .attr("y2", "100%")
    .attr("x2", "0%")
    .attr("spreadMethod", "pad");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "lightgreen")
    .attr("stop-opacity", 1);
    
  gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

  d3.select("#colorscaleSVG").append("rect")
    .attr("width", Keywidth)
    .attr("height", Keyheight)
    .style("fill", "url(#gradient)");

d3.json("us.json", function(error, us) {
  if (error) throw error;
  g.append("g")
  .attr("id", "states")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter().append("path")
  .attr("d", path);

  g.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path);

  //from lecture on 3/25
  d3.csv("data.csv", function (error, data) {
    var schools = data;

    points = schools.map(function (school) {
      return {
        x: Number(school["LONGITUDE"]),  
        y: Number(school["LATITUDE"]),   
        label: school["university_name"]
      };
    })
    .filter(function (point) {
      return ! isNaN(point.x) && ! isNaN(point.y);
    });

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return  d.label;
    });
    g.call(tip);

    circles = g.selectAll(".point").data(points);

    circles.enter().append("circle")
    .attr("class", "point")
    .attr("cx", function(d) { var coords=projection([d.x,d.y]);return coords[0]; })
    .attr("cy", function(d) { var coords=projection([d.x,d.y]);return coords[1]; })
    .attr("r", 4)
    .style("fill","green")
    .style("opacity", 0.7)
    .attr("transform","translate(" + zoomTranslate + ")scale(" + zoomScale + ")")
    .on("mouseover",tip.show)
    .on("mouseout", tip.hide);
  });
});
d3.select("#center").on("click", function () {
  /*console.log(zoomScale);
  console.log(zoomTranslate);*/
  zoom.translate([0,0]).scale(1);
  svg.selectAll("circle").transition().attr("transform","translate(0,0)scale(1)");
  svg.selectAll("path").transition().attr("transform","translate(0,0)scale(1)");
  svg.selectAll(".legend").transition().attr("transform","translate(0,0)scale(1)");
  zoomScale = 1;
  zoomTranslate = [0,0];
  
});



// //http://bl.ocks.org/mbostock/2206590
// function clicked(d) {
//   var x, y, k;

//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = centroid[0];
//     y = centroid[1];
//     k = 4;
//     centered = d;
//   } else {
//     x = width / 2;
//     y = height / 2;
//     k = 1;
//     centered = null;
//   }

//   g.selectAll("path")
//   .classed("active", centered && function(d) { return d === centered; });

//   g.transition()
//   .duration(750)
//   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
//   .style("stroke-width", 1.5 / k + "px");
// }

