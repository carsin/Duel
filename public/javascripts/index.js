var socket = io();
var username = "XD" + String(Math.round(Math.random() * 100));
var inputRoomId;
var currentRoomId = "global";
var currentReadyButtonClicked;

//
// ─── JQUERY HANDLERS ────────────────────────────────────────────────────────────
//

$(document).ready(function() {
    $("#usernameInput").val(username);

    $("#usernameInputForm").submit(function(e) {
        e.preventDefault();
        if ($("#usernameInput").val() != "") username = $("#usernameInput").val();

        return false;
    });

    $("#joinRoomViewButton").click(function() {
        $("#mainView").addClass("hidden");
        $("#joinRoomView").removeClass("hidden");
    });

    $("#createRoomViewButton").click(function() {
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
        if (currentReadyButtonClicked != $(this)) currentReadyButtonClicked = $(this);
        socket.emit("ready");

        if (currentReadyButtonClicked.html() == "Ready") {
            $(currentReadyButtonClicked).html("Unready");
        } else if (currentReadyButtonClicked.html() == "Unready") {
            $(currentReadyButtonClicked).html("Ready");
        }
    });
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

socket.on("allPlayersReady", function() {
    currentReadyButtonClicked.attr("disabled", true);
});

//
// ────────────────────────────────────────────────────────────
//   :::::: G A M E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────
//

//
// ─── CPS GAME ───────────────────────────────────────────────────────────────────
//

function runCpsGame() {
    $("#cpsGameView").removeClass("hidden");
}
