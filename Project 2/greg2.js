//Quiz
var schoolname = [];
var numstudents = [];
var studentstaff = [];
var femalemale = [];
var adminrate = [];
var research = [];
var tuition = [];
var ranks = [11.142202473750228, 7.548946504951697, 10.766775407572368, 11.032085092868606, 6.974767881557504, 7.562457688011652, 6.278932837064303, 9.641421105456596, 8.420120685183281, 7.80508101668995, 8.082998388934707, 12.286897522656052, 7.165873098087352, 6.478385123224662, 10.0116242481951, 7.831876675148097, 8.852954609342483, 13.076876799011462, 9.823604365810356, 5.865585699072382, 9.476551569862938, 9.838091000643082, 9.828530738514084, 9.069290598924368, 7.8337009251422325, 8.301547770009904, 10.387920126146605, 6.405249066143194, 9.587815794012599, 8.188112692571947, 7.383409948715717, 6.858457733614321, 12.462191077150198, 8.51750780569138, 6.842607207209865, 9.03498712607119, 5.229429556310697, 6.119053474965897, 9.426805703427288, 12.048020645059914, 8.35784058438944, 5.592683361372759, 8.71931920131553, 6.176968817226355, 8.284462340156484, 7.580704230950316, 8.30611980733169, 5.941659606021966, 6.534575560549811, 8.182258482840215, 9.51599814308965, 9.339329421094583, 9.582330308615521, 5.651673951326123, 10.588368257276876, 9.712849490839638, 7.183913421369219, 5.201892619573426, 12.332452854298989, 4.479686046382458, 7.88552759217417, 9.299097618663009, 9.391956075274864, 8.539437394950143, 9.516172943434222, 9.366831541305023, 11.84164172623633, 9.053465926581133, 7.855282032975964];
var quizArray = [numstudents, studentstaff, femalemale, tuition, adminrate, research,schoolname,ranks];

//Helper Functions for Quiz
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}
function compare(a,b) {
  if (a.score < b.score)
    return -1;
  if (a.score > b.score)
    return 1;
  return 0;
}


//KEY
var Keywidth = 100,
Keyheight = 10;
var key = d3.select("#colorscale").append("svg")
.attr("width", Keywidth)
.attr("height", Keyheight)
.attr("id", "colorscaleSVG");
//Key End

var width = screen.width*.4,  height = screen.width * (1/2), centered;

var projection = d3.geo.albersUsa()
.scale(width * 2.3)
.translate([width, height*.45]);

var path = d3.geo.path()
.projection(projection);
var zoom = d3.behavior.zoom()
.translate([0,0])
.scale(1)
.scaleExtent([1,15])
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
var points;

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

    for(var i = 0; i < points.length; i ++)
    {
      if((i+1) != 10){
        var value = i + 1; 
        var option = d3.select("#dropdown").append("option").html(value).attr("value", value);
      }else{
        var value = i + 1; 
        var option = d3.select("#dropdown").append("option").html(value).attr("value", value).attr("selected", "selected").attr("id", "ten");
      }
    }

    //Quiz
    points.forEach(function(school) {
      schoolname.push(school.label);
      research.push(school.research);
      numstudents.push(school.population);
      studentstaff.push(school.studentstaffratio);
      femalemale.push(school.femalemaleratio); 
      adminrate.push(school.adrate);
      tuition.push(school.tuition);
    });

    var answers = [];

    for(var i = 0; i < quizArray.length-2; i++)
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
    .attr("r", 5)
    .style("fill","green")
    .style("opacity", 0.9)
    // .attr("transform","translate(" + zoomTranslate + ")scale(" + zoomScale + ")")
    .on("mouseover", function (d) {
      d3.select("#sidebar").attr("class", "sidebar col-xs-2")
      .html('<li class = \'collegename\'>' + d.label +'</li> <li>Avg. Tuition After Fin. Aid: $'+d.tuition+'</li>'+'<li>Admission Rate: '+(d.adrate * 100).toFixed(1)+'%'+'</li>'+'<li>Student Population: '+d.population+'</li>' + '<li>Student-Staff Ratio: '+d.studentstaffratio +':1 </li>' 
        + '<li>Female-Male Ratio: ' + d.femalemaleratio +':'  + (100 -  d.femalemaleratio )  + ' </li>'); 
      d3.select(this).transition().attr("r",12);
    })
    .on("mouseout", function(d){
      d3.select(this).transition().attr("r",5);
    });
    return questions;
  });
});

d3.select("#usmap").on("click", function () {
  zoom.translate([0,0]).scale(1);
  svg.selectAll("circle").transition().attr("transform","translate(0,0)scale(1)");
  svg.selectAll("path").transition().attr("transform","translate(0,0)scale(1)");
  svg.selectAll(".legend").transition().attr("transform","translate(0,0)scale(1)");
  zoomScale = 1;
  zoomTranslate = [0,0];

});

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
      choicesArray.push([d3.select(this).attr("value")]); 
      if (num < questions.length-1)
        nextQuestion(num+1);
      else{
        document.getElementById("quizFinished").style.display = "block";
        quiz.html("");
        rankings();
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
    else if(num == 5){
      if(i == 0){
    label.append("span").html(" Not Research Focused"); //prints choice
  }
  if(i == 1){
    label.append("span").html(" Slightly Research Focused"); 
  }
  if(i == 2){ 
    label.append("span").html(" Somewhat Research Focused"); 
  }
  if(i == 3){
    label.append("span").html(" Moderately Research Focused"); 
  }
  if(i == 4){
    label.append("span").html(" Very Research Focused"); //prints choice
  }

}
else{
        label.append("span").html(" " + string); //prints choice
      }
    }
    return choicesArray;
  };

//Quiz End
var pref=[6,6,6,6,6,6];
function rankings(){
  ranks=[];
  for (var i=0;i<tuition.length;i++){
    var sum=0;
    var scores=[];
    var comp=[(1-(Math.abs(numstudents[i]-(parseInt(choicesArray[0][0].split(",")[0])+parseInt(choicesArray[0][0].split(",")[1])/2))/Math.max.apply(null, numstudents))),(1-(Math.abs(studentstaff[i]-(choicesArray[1][0].split(",")[0])+parseInt(choicesArray[1][0].split(",")[1])/2)/Math.max.apply(null, studentstaff))),(1-(Math.abs(femalemale[i]-(parseInt(choicesArray[2][0].split(",")[0])+parseInt(choicesArray[2][0].split(",")[1])/2))/Math.max.apply(null, femalemale))),(1-(Math.abs(tuition[i]-(parseInt(choicesArray[3][0].split(",")[0])+parseInt(choicesArray[3][0].split(",")[1])/2))/Math.max.apply(null, tuition))),(1-(Math.abs(adminrate[i]-(parseInt(choicesArray[4][0].split(",")[0])+parseInt(choicesArray[4][0].split(",")[1])/2))/Math.max.apply(null, adminrate))),(1-(Math.abs(research[i]-(parseInt(choicesArray[5][0].split(",")[0])+parseInt(choicesArray[5][0].split(",")[1])/2))/Math.max.apply(null, research)))];
    for (var j=0;j<6;j++){
      comp[j]=(comp[j]*(pref[j]*pref[j]));
      scores.push(comp[j]);
      sum+=comp[j];
    };
        for(var x = 0; x < points.length; x++)
    {
        if(points[x].label ==  schoolname[i])
        {
          console.log(sum);
          points[x].score = sum;
        }
    }
    ranks.push(sum);
  };
  console.log("stop");
  //New
  points.sort(compare);
  function rankSchools(num)
  {
    var table  = document.getElementById("table");
    table.innerHTML = "";
    var rowOne = table.insertRow(0);
    var FirstCell = rowOne.insertCell(0);
    var SecondCell = rowOne.insertCell(1);
    FirstCell.innerHTML  = "RANK";
    SecondCell.innerHTML  = "SCHOOL";
    for(var i = 0; i < num; i++)
    {
      var rowNum = i + 1;
      var row = table.insertRow(rowNum);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = rowNum;
      cell2.innerHTML = points[68-i].label;
    }
  }
  rankSchools(d3.select("#dropdown").property("value"));
  circles = g.selectAll(".point");
  circles.each(function (d,i){
    circle=d3.select(this);
    circle.transition().style("fill", function(d){
     var spectrum = d3.scale.linear().domain([Math.min.apply(null,ranks),Math.max.apply(null,ranks)]).range(["#f65ff2","#00e60f"]);
     return spectrum(ranks[i]);
   });
  });
};

document.getElementById('schoolsizeSlider').addEventListener('change', function(){
  pref[0]=parseInt(this.value);
  rankings();
});
document.getElementById('staffratioSlider').addEventListener('change', function(){
  pref[1]=parseInt(this.value);
  rankings();
});
document.getElementById('femaleratioSlider').addEventListener('change', function(){
  pref[2]=parseInt(this.value);
  rankings();
});
document.getElementById('tuitionSlider').addEventListener('change', function(){
  pref[3]=parseInt(this.value);
  rankings();
});
document.getElementById('selectivitySlider').addEventListener('change', function(){
  pref[4]=parseInt(this.value);
  rankings();
});
document.getElementById('researchSlider').addEventListener('change', function(){
  pref[5]=parseInt(this.value);
  rankings();
});

// var svg2 = d3.select("svg");
// var height = svg2.attr("height");
// var width = svg2.attr("width");
// var padding = 30;
// var xScale = d3.scale.linear().domain([1, 70]).range([padding, width]);
// var yScale = d3.scale.linear().domain([0, ]).range([height - padding, 0]);
// var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
// var yAxis = d3.svg.axis().scale(yScale).orient("left");
// svg.append("g").attr("transform", "translate(0," + (height - padding) + ")").attr("class", "axis")
// .call(xAxis);
// svg.append("g").attr("transform", "translate(" + padding + ",0)").attr("class", "axis")
// .call(yAxis);