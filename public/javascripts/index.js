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

$("#mainViewButton").click(function() {
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

$("#startGameButton").click(function() {
    var selectedGame = $("input[name=selectedGame]:checked", "#gameCreateForm").val()
    socket.emit("gameStarted", selectedGame);
    console.log(selectedGame + " game started");
});

$(".readyButton").click(function() {
    var buttonClicked = $(this);
    socket.emit("ready");

    if (buttonClicked.html() == "Ready") {
        $(buttonClicked).html("Unready");
    } else if (buttonClicked.html() == "Unready") {
        $(buttonClicked).html("Ready");
    }
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

socket.on("serverMessage", function(message) {
    $("#chatMessages").append("<li class='serverMessage'>" + message + "</li>");
});

socket.on("loadGame", function(selectedGame) {
    $("#lobbyRoomView").addClass("hidden");
    $("#gameViewContainer").removeClass("hidden");
    console.log(selectedGame + " loaded");

    switch(selectedGame) {
        case "cpsGame": runCpsGame(); break;
        case "rngGame": $("#rngGameView").removeClass("hidden"); break;
        default: console.log("couldn't find game " + selectedGame);
    }
});

//
// ────────────────────────────────────────────────── I ──────────
//   :::::: G A M E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

//
// ─── CPS GAME ───────────────────────────────────────────────────────────────────
//

function runCpsGame() {
    $("#cpsGameView").removeClass("hidden");
}
