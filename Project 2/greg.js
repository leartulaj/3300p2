 	//MAP
 	var width = screen.width,  height = screen.width * (3/4);
 	var usa = d3.geo.albersUsa()
 	.scale(width * .9)
 	.translate([width / 2, height / 3]);
    projection=d3.geo.albersUsa();

    var path = d3.geo.path().projection(usa);

    var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "col-xs-12");
    var g = svg.append("g");
    var longitude = [];
    var latitude = [];

    d3.json("us.json", function(error, us){
     if (error) throw error;

        //http://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript
        $(document).ready(function() {
           $.ajax({
            type: "GET",
            url: "collegedata.csv",
            dataType: "text",
            success: function(data) {processData(data);}
        });
           function processData(data) {
            var lines = data.split(/\r\n|\n/);

            var headings = lines[0].split(','); 

            for (var j=1; j<lines.length; j++) {
                var values = lines[j].split(','); 
                console.log(values[6]);
                longitude.push(values[6]); 
                latitude.push(parseFloat(values[7])); 
            }
            for (var i=0;i<70;i++){
                var statlongitude=longitude[i];
                var statlatitude=latitude[i];
                var coords=usa([statlongitude,statlatitude]);
                if (coords==null){
                    i=i;
                }else{
                   g.append("circle").attr("cx", coords[0]).attr("cy", coords[1]).attr("r", 3).style("fill","blue");
               }
           }
       }
   });
    g.append("path", ".graticule")
    .datum(topojson.feature(us, us.objects.land))
    .attr("class", "land")
    .attr("d", path);

    g.append("path", ".graticule")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "state-boundary")
    .attr("d", path);
});

 	//SLIDER FUNCTIONALITY
 	var schoolsizeSlider = document.getElementById("schoolsizeSlider");
 	var event1 = function()
 	{
 		document.getElementById("schoolsize").innerHTML = schoolsizeSlider.value;
 	}
 	schoolsizeSlider.onchange = event1;

 	var staffratioSlider = document.getElementById("staffratioSlider");
 	var event2 = function()
 	{
 		document.getElementById("staffratio").innerHTML = staffratioSlider.value;
 	}
 	staffratioSlider.onchange = event2;

 	var femaleratioSlider = document.getElementById("femaleratioSlider");
 	var event3 = function()
 	{
 		document.getElementById("femaleratio").innerHTML = femaleratioSlider.value;
 	}
 	femaleratioSlider.onchange = event3;

 	var roiSlider = document.getElementById("roiSlider");
 	var event4 = function()
 	{
 		document.getElementById("roi").innerHTML = roiSlider.value;
 	}
 	roiSlider.onchange = event4;

 	var selectivitySlider = document.getElementById("selectivitySlider");
 	var event5 = function()
 	{
 		document.getElementById("selectivity").innerHTML = selectivitySlider.value;
 	}
 	selectivitySlider.onchange = event5;

 	var researchSlider = document.getElementById("researchSlider");
 	var event6 = function()
 	{
 		document.getElementById("research").innerHTML = researchSlider.value;
 	}
 	researchSlider.onchange = event6;