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

$("#roomJoinSubmitButton").click(function() {
    if ($("#roomJoinIdInput").val() == "") {
        alert("no id input")
    } else {
        socket.emit("attemptRoomJoin", username, $("#roomJoinIdInput").val());
        console.log(username + " try join game" +  $("#roomJoinIdInput").val());
    }
});

$("#createGameButton").click(function() {
    socket.emit("game create", username, $("input[name=selectedGame]:checked", "#gameCreateForm").val())
});

socket.on("room created", function(roomId) {
    console.log("room joined");
    $("#roomId").html(roomId);
});

socket.on("room join failed", function() {
    console.log("room join failed");
});

socket.on("room join success", function() {
    console.log("room join success");
});
