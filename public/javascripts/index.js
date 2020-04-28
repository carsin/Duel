var socket = io();
var username = "Default";
var inputRoomId;

function getUsername() {
    if ($("#usernameInput").val() != "") username = $("#usernameInput").val();
    return username;
}

$("#joinRoomViewButton").click(function() {
    getUsername();
    $("#mainView").addClass("hidden");
    $("#joinRoomView").removeClass("hidden");
});

$("#createRoomViewButton").click(function() {
    getUsername();
    socket.emit("createRoom", username);
});

$(".mainViewButton").click(function() {
    $("#joinRoomView").addClass("hidden");
    $("#lobbyRoomView").addClass("hidden");
    $("#mainView").removeClass("hidden");
});

$("#roomJoinSubmitButton").click(function() {
    if ($("#roomJoinIdInput").val() == "") {
        alert("no id input")
    } else {
        inputRoomId = $("#roomJoinIdInput").val();
        socket.emit("attemptRoomJoin", username, inputRoomId);
    }
});

socket.on("room created", function(roomId) {
    console.log("room joined");
    $("#roomIdDisplay").html(roomId);
    $("#mainView").addClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");
});

socket.on("room join failed", function() {
    alert("Failed joining room " + inputRoomId);
});

socket.on("room join success", function(room) {
    console.log("room join success");
});

socket.on("newPlayerJoin", function(username) {
    $("#playerList").append("<li>" + username + "</li>")
});
