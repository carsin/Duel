$(document).ready(function() {
    var inputRoomId;
    var currentReadyButtonClicked;
    // Connect to server
    var socket = io();

    //
    // ─── JQUERY HANDLERS ────────────────────────────────────────────────────────────
    //

    $("#usernameInputForm").submit(function(e) {
        e.preventDefault();
        username = $("#usernameInput").val().replace(/</g, "&lt;").replace(/>/g, "&gt;");
        if (username.trim() != "" && username.length <= 16) {
            socket.emit("setUsername", username);
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
        socket.emit("createRoom");
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
            socket.emit("attemptRoomJoin", inputRoomId);
        }

    });

    $("#chatMessageForm").submit(function(e) {
        e.preventDefault();
        message = $("#chatMessageInput").val();

        if (message.trim() != "") {
            if (message.length < 200) {
                socket.emit("chatMessage", message)
            } else {
                $("#chatMessages").append("<li class='serverMessage'>Your message is greater than 200 characters!</li>");
            }

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
        $("#chatMessages").append("<li>" + username + ": " +  message + "</li>");
    });

    socket.on("serverMessage", function(message) {
        $("#chatMessages").append("<li class='serverMessage'>" + message + "</li>");
    });

    socket.on("changeUsername", function(username) {
        $("#usernameDisplay").html(" " + username)
        $("#usernameInput").val("");
        $("#chatMessages").append("<li class='serverMessage'>Username set to " + username + "</li>");
    });

    socket.on("loadGame", function(selectedGame) {
        $("#lobbyRoomView").addClass("hidden");
        $("#gameViewContainer").removeClass("hidden");
        console.log(selectedGame + " loading");

        try {
            $("#" + selectedGame + "View").removeClass("hidden");
            $("#" + selectedGame + "ReadyView").removeClass("hidden");
        } catch(e) {
            console.log("couldn't find game " + selectedGame);
        }
    });

    socket.on("allPlayersReady", function(game) {
        currentReadyButtonClicked.attr("disabled", true);
        // Ready countdown
        countdownCount = 3;
        $("#" + game + "ReadyCountdown").html(countdownCount);
        var countdownTimer = setInterval(function() {
            if (countdownCount <= 0) {
                clearInterval(countdownTimer);
                $("#" + game + "ReadyView").addClass("hidden");
                $("#" + game).removeClass("hidden");

                switch(game) {
                    case "cpsGame": runCpsGame(); break;
                    case "rngGame": runRngGame(); break;
                    default: console.log("Couldn't run game " + game); break;
                }

                return;
            }

            countdownCount--;
            $("#" + game + "ReadyCountdown").html(countdownCount);
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
        seconds = 10;
        clock = 0;
        updateInterval = 10; // How often time is progressed
        clickCount = 0;

        timer = setInterval(function() {
                clock++;
                realClock = (clock / (1000 / updateInterval));
                displayClock = Number((Math.round(realClock + "e+2") + "e-2"));
                $("#cpsGameTimerDisplay").html(" " + displayClock);

                // Check if time is up
                if (realClock >= seconds) {
                    clearInterval(timer);
                    // $("#cpsGameTimerDisplay").html(seconds); // Sneakily fix the counter >:D
                    console.log("CPS: " + (clickCount / seconds));
                    socket.emit("cpsGameComplete", Number(clickCount / seconds));
                    return;
                }
        }, updateInterval);

        $("#cpsGameClickButton").click(function() {
            clickCount++;
        });

    }

    //
    // ─── RNG GAME ───────────────────────────────────────────────────────────────────
    //

    function runRngGame() {

    }
});
