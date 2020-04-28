//
// ────────────────────────────────────────────────────────────────────────────────────-─────────
//   :::::: C L I E N T - S I D E   J A V A S C R I P T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────
//

var socket = io();
var username = "Default";
var inputRoomId;
var currentRoomId = "";

function getUsername() {
    if ($("#usernameInput").val() != "") username = $("#usernameInput").val();
    return username;
}

//
// ─── JQUERY HANDLERS ────────────────────────────────────────────────────────────
//

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
    location.reload();
});

$("#roomJoinSubmitButton").click(function() {
    if ($("#roomJoinIdInput").val() == "") {
        alert("no id input")
    } else {
        inputRoomId = $("#roomJoinIdInput").val();
        socket.emit("attemptRoomJoin", username, inputRoomId);
    }
});

$("#chatMessageForm").submit(function(e) {
    e.preventDefault();
    socket.emit("chatMessage", $("#chatMessageInput").val(), username, currentRoomId)
    $("#chatMessageInput").val("");
    return false;
});

//
// ─── SOCKET HANDLERS ────────────────────────────────────────────────────────────
//

socket.on("confirmRoomCreation", function(roomId) {
    currentRoomId = roomId;
    $("#roomIdDisplay").html(roomId);
    $("#mainView").addClass("hidden");
    $("#gameCreateForm").removeClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");
});

socket.on("roomJoinFail", function() {
    alert("Failed joining room " + inputRoomId);
});

socket.on("roomJoinSuccess", function(room, roomId) {
    currentRoomId = roomId;
    $("#roomIdDisplay").html(roomId);
    $("#joinRoomView").addClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");
});

socket.on("updatePlayerList", function(usernames) {
    $("#playerList").html("");
    for (var i = 0; i < usernames.length; i++) {
        if (i == 0) {
            $("#playerList").append("<li>" + usernames[i] + " (host) </li>");
        } else {
            $("#playerList").append("<li>" + usernames[i] + "</li>");
        }
    }
});

socket.on("chatMessage", function(message, username) {
    $("#chatMessages").append("<li>" + username + ": " +  message + "</li>");
});
