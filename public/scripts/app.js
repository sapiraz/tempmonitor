var app = angular.module("monitorApp",["ngRoute","ngAnimate"])
.config(function($routeProvider){
  $routeProvider.when("/",{
    templateUrl:"templates/monitor.html",
    controller:"monitorController"
  });
});
