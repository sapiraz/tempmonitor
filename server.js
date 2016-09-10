var express         = require("express");
var app             = express();
var socket          = require("socket.io");
var server          = require('http').Server(app);
var WeatherAPI      = require('./includes/WeatherAPI.js');
var GooglePlacesAPI = require('./includes/GooglePlacesAPI.js');
var gapi            = new GooglePlacesAPI("AIzaSyCkYza4vF9as5O6eknmnXJpJjWl47sMcN0");
var wapi            = new WeatherAPI("4b9dc2e976d4bbdd200c984d3b58c332");
var connections     = [];
var fs              = require("fs");
app.use(express.static("public"));

var io = require('socket.io')(3000);

app.listen(80,function(){
  console.log("Server is listening");
});
function getCountryName(id){
  try {
    var countries = JSON.parse(fs.readFileSync("./countries.json"));
    for(var i = 0; i < countries.length; i++){
      var curr = countries[i];
      if(curr.code == id){
        return curr.name;
      }
    }
    return false;
  } catch(e){
    console.log("Error parsing countries");
    return false;
  }
}
//Try loading points from file
var points = [];
try {
  points = JSON.parse(fs.readFileSync("points.json"));
} catch(e){
  console.log("Could not load points from json file.");
}

function savePoints(){
  fs.writeFile("points.json",JSON.stringify(points));
}

var broadcast = function(id,val){
  connections.forEach(function(socket){
    socket.emit(id,val);
  });
}
var getRandomPoint = function(){
  return points.length ? points[Math.floor(Math.random() * points.length)] : false;
}

//Every X time update X places in our database
setInterval(function(){

  var point = getRandomPoint();
  if(point){

    wapi.getWeatherByCoords(point.samplePoint.lat,point.samplePoint.lon,function(data){
      if(Array.isArray(point.data)){
        point.data.unshift(data);
      }
      point.country = getCountryName(data.sys.country);
      //Save new point data
      savePoints();
      //Let everyone know about it
      console.log("Broadcasting new temps to all clients");
      broadcast("receiveSample",point);
    });
  }


},10000);


//Every X time try to find a new place in google maps
setInterval(function(){
  gapi.findRandomPlace(function(place){
    if(place){
      //Found a new place, verify we can receive weather data on it
      wapi.getWeatherByCoords(place.geometry.location.lat,place.geometry.location.lng,function(data){
        if(data){
          //Found a place with valid temperatures.
          console.log(`Added new place: ${place.name}`);
          points.push({
            uid:Date.now(),
            name:place.name,
            address:place.vicinity,
            country: getCountryName(data.sys.country),
            samplePoint:{lat:place.geometry.location.lat, lon:place.geometry.location.lng},
            data:[data],
            lastUpdate:Date.now()
          });
          savePoints();
        } else {
          console.log("Skipped place: ${place.name} due to invalid temperatures");
        }
      });
    } else {
      //No new place found..
    }
  });
},30000);


io.on('connection', function (socket) {
  connections.push(socket);
  console.log("Connection initialized");
  socket.on("disconnect",function(){
    console.log("Connection lost.");
    for(var i = 0; i < connections.length; i++){
      if(connections[i] === socket){
        connections.splice(i,1);
      }
    }
  });
});
