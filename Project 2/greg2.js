//Quiz
var numstudents = [];
var studentstaff = [];
var femalemale = [];
var adminrate = [];
var research = [];
var tuition = [];
var quizArray = [numstudents, studentstaff, femalemale, tuition, adminrate, research];

//Helper Functions for Quiz
    function getMaxOfArray(numArray) {
      return Math.max.apply(null, numArray);
    }
    function getMinOfArray(numArray) {
      return Math.min.apply(null, numArray);
    }


//KEY
var Keywidth = 100,
Keyheight = 10;
var key = d3.select("#colorscale").append("svg")
.attr("width", Keywidth)
.attr("height", Keyheight)
.attr("id", "colorscaleSVG");
//Key End

var width = screen.width,  height = screen.width * (3/4);

var projection = d3.geo.albersUsa()
.scale(width * .9)
.translate([width / 2.5, height / 3]);

var path = d3.geo.path()
.projection(projection);
// var zoom = d3.behavior.zoom()
//   .translate([0,0])
//   .scale(1)
//   .scaleExtent([1,8])
//   .on("zoom", zoomed);


// var zoomTranslate = [0,0];
// var zoomScale = 1;
// function zoomed() {
//   zoomTranslate = d3.event.translate;
//   svg.selectAll("circle").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//   zoomScale = d3.event.scale;
//   svg.selectAll("path").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//   svg.selectAll(".legend").attr("transform","translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

// }

var svg = d3.select("#usmap")
.attr("width", width)
.attr("height", height)
.attr("class", "col-xs-10");
// .call(zoom);

// svg.append("rect")
// .attr("class", "background")
// .attr("width", width)
// .attr("height", height);

var g = svg.append("g");

// var Keywidth = 10,
//     Keyheight = 200;
//   var key = d3.select("#colorscale").append("svg")
//     .attr("width", Keywidth)
//     .attr("height", Keyheight)
//     .attr("id", "colorscaleSVG");

//     var gradient = d3.select("#colorscaleSVG").append("defs")
//     .append("linearGradient")
//     .attr("id", "gradient")
//     .attr("y1", "0%")
//     .attr("x1", "0%")
//     .attr("y2", "100%")
//     .attr("x2", "0%")
//     .attr("spreadMethod", "pad");

//   gradient.append("stop")
//     .attr("offset", "0%")
//     .attr("stop-color", "lightgreen")
//     .attr("stop-opacity", 1);

//   gradient.append("stop")
//     .attr("offset", "100%")
//     .attr("stop-color", "red")
//     .attr("stop-opacity", 1);

//   d3.select("#colorscaleSVG").append("rect")
//     .attr("width", Keywidth)
//     .attr("height", Keyheight)
//     .style("fill", "url(#gradient)");

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
      /*
      research.push(school["research"]);
      numstudents.push(school["num_students"]);
      studentstaff.push(school["student_staff_ratio"]); 
      femalemale.push(school["female_male_ratio"]);
      adminrate.push(school["ADM_RATE"]);
      tuition.push(school["TUITFTE"]);
      */

      return {
        x: Number(school["LONGITUDE"]),  
        y: Number(school["LATITUDE"]),   
        label: school["university_name"],
        adrate: Number(school["ADM_RATE"]),
        tuition: Number(school["TUITFTE"]),
        population: Number(school["num_students"]),
        research: Number(school["research"]),
        studentstaffratio:  Number(school["student_staff_ratio"]),
        femalemaleratio: Number(school["female_male_ratio"])
      };
    })


    .filter(function (point) {
      return ! isNaN(point.x) && ! isNaN(point.y);
    });

    //Quiz
    points.forEach(function(school) {
      research.push(school.research);
      numstudents.push(school.population);
      studentstaff.push(school.studentstaffratio);
      femalemale.push(school.femalemaleratio); 
      adminrate.push(school.adrate);
      tuition.push(school.tuition);
    });

    var answers = [];

    for(var i = 0; i < quizArray.length; i++)
    {
      answers.push([]);
      var max = getMaxOfArray(quizArray[i]);
      var min = getMinOfArray(quizArray[i]);
      var rangeLength = (max - min)/5;
      for(var x = 0; x < 5; x++)
      {
        
        answers[i].push(new Object())
        if(i != 4 ){
        answers[i][x].min = Math.round(min + x * rangeLength); //left off here
        answers[i][x].max = Math.round(min + (x + 1) * rangeLength);
        }else{ //we dont want to round here
          answers[i][x].min = d3.round(min + x * rangeLength, 3); //left off here
          answers[i][x].max = d3.round(min + (x + 1) * rangeLength, 3);
        }


      }
    }


    //Create JSON
    var questionsArray = ["What is your desired school size?", "What is your desired student-staff Ratio?", "What is your desired female-male Ratio?", "What do you approximate to be the most you will be able to pay after financial aid is awarded?", "How selective do you want your desired school to be based on admission rate?", "How research intensive do you want your desired school to be?" ];
    var topicArray = ["schoolsize", "studentstaffratio", "femalemaleratio", "tuition", "selective", "research" ]
    var json = "[";
    for(var i = 0; i < answers.length; i++ )
    {
      json = json + "{\"question\": \"" + questionsArray[i]  + "\", \"choices\" :" + JSON.stringify(answers[i]) +  ", \"topic\": \""  + topicArray[i] + "\"}";
      if(i != answers.length - 1 ) 
      {
        json = json + ",";
      }else
      {
        json = json + "]";
      }

    }
    questions = JSON.parse(json);

  
    //Quiz End




    circles = g.selectAll(".point").data(points);

    circles.enter().append("circle")
    .attr("class", "point")
    .attr("cx", function(d) { var coords=projection([d.x,d.y]);return coords[0]; })
    .attr("cy", function(d) { var coords=projection([d.x,d.y]);return coords[1]; })
    .attr("r", 4)
    .style("fill","green")
    .style("opacity", 0.7)
    // .attr("transform","translate(" + zoomTranslate + ")scale(" + zoomScale + ")")
    .on("mouseover", function (d) {
      d3.select("#sidebar").html(d.label+'<li>Tuition: $'+d.tuition+'</li>'+'<li>Admission Rate: '+(d.adrate * 100).toFixed(1)+'%'+'</li>'+'<li>Student Population: '+d.population+'</li>');
    });

    return questions;
  });
});




// d3.select("#center").on("click", function () {
//   /*console.log(zoomScale);
//   console.log(zoomTranslate);*/
//   zoom.translate([0,0]).scale(1);
//   svg.selectAll("circle").transition().attr("transform","translate(0,0)scale(1)");
//   svg.selectAll("path").transition().attr("transform","translate(0,0)scale(1)");
//   svg.selectAll(".legend").transition().attr("transform","translate(0,0)scale(1)");
//   zoomScale = 1;
//   zoomTranslate = [0,0];

// });

//QUIZ


var choicesArray = [];
var nextQuestion = function(num) 
{
  var quiz = d3.select("#quiz");
  var question = questions[num];
  var choices = question["choices"];

  quiz.html("");
  quiz.append("div").attr("id", num + "").html(question["question"]);

  for (var i = 0; i < choices.length; i++) 
  {
    var choice = choices[i];
    var label = quiz.append("label").attr("class", "choice");
    var input = label.append("input").attr("type", "radio").attr("name", question["topic"]).attr("value", [choice.min, choice.max, i]  + "")
    .on("click", function(e, idx) 
    {
      //choicesArray.push(choices[idx]);
      choicesArray.push([d3.select(this).attr("value")]); 
      if (num < questions.length-1)
        nextQuestion(num+1);
      else{
        document.getElementById("quizFinished").style.display = "block";
        quiz.html("");
      }

    });
    var string = choice.min + " to " + choice.max;
    if(num == 1){
        //formating for student-teacher ratios
        var subtring = string.split(/ /);
        label.append("span").html(" " + subtring[0] + ":1 " + subtring[1] + " " + subtring[2] + ":1 "  ); //prints choice
    }
    else if(num == 2){
      //formating for female-male ratios
      var subtring = string.split(/ /);
      var maleratioone = 100 - Number(subtring[0]); 
      var maleratiotwo = 100 - Number(subtring[2]); 
      label.append("span").html(" " + subtring[0] + ":" + maleratioone + " " + subtring[1] + " " + subtring[2] + ":" + maleratiotwo ); //prints choice
    }
    else{
        label.append("span").html(" " + string); //prints choice
    }
  }
  return choicesArray;
};

console.log(choicesArray); 
//Quiz End