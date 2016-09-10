app.controller("monitorController",["socketConnection","$scope",function(socketConnection,$scope){
  $scope.placesViewing = [];
  $scope.placesVisited = [];
  $scope.viewerReady = function(){
  }
  $scope.time = function(timestamp){
    var date = new Date(timestamp * 1000);
    return date.getHours() + ":" + date.getMinutes();
  }
  $scope.tempColor = function(temp){
    //Takes celsius degrees
    var color = {};
    if(temp < 10){
      color = {r:0,g:86,b:255};
    } else if(temp > 10 && temp < 20){
      color = {r:97,g:210,b:255};
    } else if(temp > 20 && temp < 30){
      color = {r:255,g:204,b:0};
    } else if(temp > 30){
      color = {r:255,g:16,b:0};
    }
    return `rgba(${color.r},${color.g},${color.b},1)`;
  }
  $scope.$on("receiveSample",function(evt,data){
    //Server sent new data.
    //Check if the sample has already been visited.
    var visited = false;
    for(var i = 0; i < $scope.placesVisited.length; i++){
      var curr = $scope.placesVisited[i];
      if(curr.uid === data.uid){
        visited = true;
        curr.data = data.data;
        //TODO: Update entity data
      }
    }
    if(!visited){
      data.entity = $scope.viewer.entities.add({
        name : data.data[0].name,
        position: Cesium.Cartesian3.fromDegrees(data.samplePoint.lon, data.samplePoint.lat),
        point : {
          pixelSize : 20,
          color : Cesium.Color.RED.withAlpha(0.5),
          outlineWidth : 2,
          outlineColor : Cesium.Color.BLACK
        },
        label : {
    	     text : data.data[0].name,
           font : '14pt Arial',
           style: Cesium.LabelStyle.FILL_AND_OUTLINE,
           outlineWidth : 0,
           verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
           pixelOffset : new Cesium.Cartesian2(0, -15)
         }
       });
       $scope.placesVisited.push(data);
       $scope.placesViewing.push(data);
       $scope.viewer.flyTo(data.entity,{offset:new Cesium.HeadingPitchRange(0, -Cesium.Math.PI_OVER_TWO, 5050)});
       if($scope.placesViewing.length > 1){
         $scope.placesViewing.splice(0,1);
       }
       $scope.$apply();
    }
  });
}]);
