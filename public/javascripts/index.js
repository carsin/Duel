var socket = io();

socket.on("connect", function() {
    socket.emit("index view")
});

$("#joinRoomButton").click(function() {
    socket.emit("room join");
});

$("#createRoomButton").click(function() {
    socket.emit("room create");
});

socket.on("redirect", function(destination) {
    window.location.href = destination;
});
