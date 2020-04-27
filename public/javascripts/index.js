var socket = io();

$("#createRoomButton").click(function() {
    socket.emit("room create");
});

socket.on("redirect", function(destination) {
    window.location.href = destination;
});
