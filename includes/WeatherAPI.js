//Weather API By Raz Sapir
var request = require("request");
var WeatherAPI = function(key){
  this.api_key = key;
  var api_path = "http://api.openweathermap.org/data/2.5/weather?";
  this.getWeatherByCoords = function(lat,lon,callback){
    request(`${api_path}lat=${lat}&lon=${lon}&units=metric&appid=${this.api_key}`,function(err,res,body){
      try {
        var data = JSON.parse(body);
        if(data.hasOwnProperty("name") && data.name){
          callback(data);
        } else {
          callback(false);
        }
      } catch(e){
        callback(false);
      }
    });
  }
}

var exports = module.exports = WeatherAPI;
