app.service("socketConnection",["$rootScope",function($rootScope){
    console.log("Connecting to web socket");
    var socket = io.connect("http://127.0.0.1:3000");
    this.connected = false;
    socket.on("connect",function(){
      this.connected = true;
      console.info("Socket connected.");
      socket.on("receiveSample",function(data){
        $rootScope.$broadcast("receiveSample",data);
      });
    });
}]);
