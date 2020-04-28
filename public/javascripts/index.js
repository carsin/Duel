//
// ────────────────────────────────────────────────────────────────────────────────────-─────────
//   :::::: C L I E N T - S I D E   J A V A S C R I P T : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────
//

var socket = io();
var username = "Default";
var inputRoomId;

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

//
// ─── SOCKET HANDLERS ────────────────────────────────────────────────────────────
//

socket.on("room created", function(roomId) {
    console.log("room joined");
    $("#roomIdDisplay").html(roomId);
    $("#mainView").addClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");
});

socket.on("room join failed", function() {
    alert("Failed joining room " + inputRoomId);
});

socket.on("room join success", function(room, roomId) {
    $("#roomIdDisplay").html(roomId);
    $("#joinRoomView").addClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");

});

socket.on("updatePlayerList", function(usernames) {
    $("#playerList").html("");
    for (var i = 0; i < usernames.length; i++) {
        $("#playerList").append("<li>" + usernames[i] + "</li>");
    }
});
