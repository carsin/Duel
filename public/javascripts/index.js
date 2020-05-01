var socket = io();
var username = "XD" + String(Math.round(Math.random() * 100));
var inputRoomId;
var currentRoomId = "global";
var currentReadyButtonClicked;

//
// ─── JQUERY HANDLERS ────────────────────────────────────────────────────────────
//

$(document).ready(function() {
    $("#usernameDisplay").html(" " + username)
    $("#usernameInputForm").submit(function(e) {
        e.preventDefault();
        getUsername = $("#usernameInput").val();
        if (getUsername.trim() != "" && getUsername.length <= 16) {
            username = getUsername.replace(/</g, "&lt;").replace(/>/g, "&gt;");;
            $("#usernameDisplay").html(" " + username)
            $("#usernameInput").val("");
        } else {
            $("#usernameInput").val("");
            alert("Username is empty or more than 16 characters long.");
        }
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

    $("#roomJoinForm").submit(function(e) {
        e.preventDefault();
        if ($("#roomJoinIdInput").val() == "") {
            alert("no id input")
        } else {
            inputRoomId = $("#roomJoinIdInput").val();
            socket.emit("attemptRoomJoin", username, inputRoomId);
        }

    });

    $("#chatMessageForm").submit(function(e) {
        e.preventDefault();
        message = $("#chatMessageInput").val();

        if (message.trim() != "") {
            socket.emit("chatMessage", message, username, currentRoomId)
        } else {
            alert("Your message is empty");
        }

        $("#chatMessageInput").val("");
    });

    $("#startGameButton").click(function() {
        selectedGame = $("input[name=selectedGame]:checked", "#gameCreateForm").val()
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
    $("#roomIdDisplay").html(" " + roomId);
    $("#mainView").addClass("hidden");
    $("#gameCreateForm").removeClass("hidden");
    $("#lobbyRoomView").removeClass("hidden");
});

socket.on("roomJoinFail", function() {
    alert("Failed joining room " + inputRoomId);
});

socket.on("roomJoinSuccess", function(room, roomId) {
    currentRoomId = roomId;
    $("#roomIdDisplay").html(" " + roomId);
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
    // Prevent html injection
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    $("#chatMessages").append("<li>" + username + ": " +  message + "</li>");
});

socket.on("serverMessage", function(message) {
    // Prevent html injection
    message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");


    $("#chatMessages").append("<li class='serverMessage'>" + message + "</li>");
});

socket.on("loadGame", function(selectedGame) {
    $("#lobbyRoomView").addClass("hidden");
    $("#gameViewContainer").removeClass("hidden");
    console.log(selectedGame + " loading");

    switch(selectedGame) {
        case "cpsGame":
            $("#cpsGameView").removeClass("hidden");
            $("#cpsGameReadyView").removeClass("hidden");
            break;
        case "rngGame":
            $("#rngGameView").removeClass("hidden");
            $("#rngGameReadyView").removeClass("hidden");
            break;
        default: console.log("couldn't find game " + selectedGame);
    }
});

socket.on("allPlayersReady", function() {
    currentReadyButtonClicked.attr("disabled", true);

    // Ready countdown
    countdownCount = 5;
    $("#cpsGameReadyCountdown").html(countdownCount);
    var countdownTimer = setInterval(function() {
        if (countdownCount <= 0) {
            clearInterval(countdownTimer);
            $("#cpsGameReadyView").addClass("hidden");
            $("#cpsGame").removeClass("hidden");
            runCpsGame();
            return;
        }

        countdownCount--;
        $("#cpsGameReadyCountdown").html(countdownCount);
    }, 1000)
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
}
