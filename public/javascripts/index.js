var socket = io();

// socket.on("connect", function() {
//     socket.emit("index view")
// });

$("#joinRoomViewButton").click(function() {
    socket.emit("room join");
    $("#mainView").hide();
    $("#joinRoomView").show();
});

$("#createRoomViewButton").click(function() {
    socket.emit("room create");
    $("#mainView").hide();
    $("#createRoomView").show();
});

$(".mainViewButton").click(function() {
    $("#joinRoomView").hide();
    $("#createRoomView").hide();
    $("#mainView").show();
});

$("#createGameButton").click(function() {
    socket.emit("game create", $("#usernameInput").val(), $("input[name=selectedGame]:checked", "#gameCreateForm").val())
});
