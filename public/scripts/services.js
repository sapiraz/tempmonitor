app.service("socketConnection",["$rootScope",function($rootScope){
    console.log("Connecting to web socket");
    var socket = io.connect("http://10.0.0.11:3000");
    this.connected = false;
    socket.on("connect",function(){
      this.connected = true;
      console.info("Socket connected.");
      socket.on("receiveSample",function(data){
        $rootScope.$broadcast("receiveSample",data);
      });
    });
}]);
