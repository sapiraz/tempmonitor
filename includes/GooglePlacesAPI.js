var request = require("request");
var GooglePlacesAPI = function(key){
  this.key = key;
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json
  // ?location=-33.8670522,151.1957362
  // &radius=500
  // &types=food
  // &name=harbour
  // &key=AIzaSyCkYza4vF9as5O6eknmnXJpJjWl47sMcN0
  var api_path = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
  this.getRandomCoords = function(){
    var coords = {};
    coords.lat = -90 + (Math.random() * 180);
    coords.lon = -180 + (Math.random() * 360);
    return coords;
  }
  this.findRandomPlace = function(callback){
    var coords = this.getRandomCoords();
    // console.log(`${api_path}location=${coords.lat},${coords.lon}&radius=10000&types=food&key=${this.key}`);
    request(`${api_path}location=${coords.lat},${coords.lon}&radius=2000&key=${this.key}`,function(err,res,body){
      try {
        var result = JSON.parse(body);
        if(result.hasOwnProperty("results") && result.results.length){
          callback(result.results[0]); // return the first match
        } else {
          try {
            console.log(`Zero results ${coords.lat},${coords.lon}`);
            callback(false);
          } catch(e){}
        }
      } catch(e){
        try {
          console.log("Some error");
          callback(false);
        } catch(e){}
      }
    });
  }
}

var exports = module.exports = GooglePlacesAPI;
