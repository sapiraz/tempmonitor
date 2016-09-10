app.directive("globe",function(){
  var viewer;
  var link = function(scope,element,attrs){
    scope.viewer = viewer;
    scope.viewerReady();
  }
  return {
    restrict:"A",
    compile:function(element, attrs, transclude){
      element[0].id = "globe_" + Date.now();
      element[0].setAttribute("data-bound","initialized");
      viewer = new Cesium.Viewer(element[0].id,{animation:false,fullscreenButton:false,timeline:false,creditContainer:"cesium-copy",homeButton:false,infoBox:false,navigationHelpButton:false,navigationInstructionsInitiallyVisible:false,baseLayerPicker:false,geocoder:false,sceneModePicker:false});
      return link;
    }
  }
});
