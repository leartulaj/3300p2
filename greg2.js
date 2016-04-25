var width = screen.width,  height = screen.width * (3/4), centered;

var projection = d3.geo.albersUsa()
.scale(width * .9)
.translate([width / 2, height / 3]);
projection=d3.geo.albersUsa();;

var path = d3.geo.path()
.projection(projection);

var svg = d3.select("#map").append("svg")
.attr("width", width)
.attr("height", height)
.attr("class", "col-xs-12");;

var longitude = [];
var latitude = [];
var schools=[];

svg.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height)
.on("click", clicked);

var g = svg.append("g");

d3.json("us.json", function(error, us) {
  if (error) throw error;
  $(document).ready(function() {
   $.ajax({
    type: "GET",
    url: "data.csv",
    dataType: "text",
    success: function(data) {processData(data);}
  });
   function processData(data) {
    var lines = data.split(/\r\n|\n/);

    var headings = lines[0].split(','); 

    var x=11;
    var y=16;
    var b=17;
    for (var j=1; j<headings.length; j++) { 
      schools.push(headings[x]);
      longitude.push(headings[b]); 
      latitude.push(parseFloat(headings[y]));
      x+=10;
      y+=10;
      b+=10;
    }
    for (var i=0;i<150;i++){
      var statlongitude=longitude[i];
      var statlatitude=latitude[i];
      var coords=projection([statlongitude,statlatitude]);
      if (coords==null){
        i=i;
      }else{
       g.append("circle").attr("cx", coords[0]).attr("cy", coords[1]).attr("r", 4).style("fill","blue")
       .on("mouseover", function() {
        d3.select(this).enter().append("text")
            .text(function(d) {return schools[i];})
            .attr("x", function(d) {return x(d.x);})
            .attr("y", function (d) {return y(d.y);}); });;
     }
   }
 }
});

  g.append("g")
  .attr("id", "states")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .enter().append("path")
  .attr("d", path)
  .on("click", clicked);

  g.append("path")
  .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
  .attr("id", "state-borders")
  .attr("d", path);
});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
  .classed("active", centered && function(d) { return d === centered; });

  g.transition()
  .duration(750)
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  .style("stroke-width", 1.5 / k + "px");
}
