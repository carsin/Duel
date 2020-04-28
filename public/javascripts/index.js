var socket = io();

// socket.on("connect", function() {
//     socket.emit("index view")
// });

$("#joinRoomButton").click(function() {
    socket.emit("room join");
    $("#mainView").hide();
    $("#joinRoomView").show();
});

$("#createRoomButton").click(function() {
    socket.emit("room create");
    $("#mainView").hide();
    $("#createRoomView").show();
});

$(".mainMenuButton").click(function() {
    $("#joinRoomView").hide();
    $("#createRoomView").hide();
    $("#mainView").show();
});

// socket.on("redirect", function(destination) {
//     window.location.href = destination;
// });
