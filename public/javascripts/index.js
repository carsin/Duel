var socket = io();
var username = "Default";

function getUsername() {
    if ($("#usernameInput").val() != "") {
        username = $("#usernameInput").val();
    }

    return username;
}

$("#joinRoomViewButton").click(function() {
    getUsername();
    socket.emit("room join");
    $("#mainView").addClass("hidden");
    $("#joinRoomView").removeClass("hidden");
});

$("#createRoomViewButton").click(function() {
    getUsername();
    socket.emit("room create");
    $("#mainView").addClass("hidden");
    $("#createRoomView").removeClass("hidden");
});

$(".mainViewButton").click(function() {
    $("#joinRoomView").addClass("hidden");
    $("#createRoomView").addClass("hidden");
    $("#mainView").removeClass("hidden");
});

$("#createGameButton").click(function() {
    socket.emit("game create", username, $("input[name=selectedGame]:checked", "#gameCreateForm").val())
});
