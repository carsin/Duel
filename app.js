const express = require("express");
const logger = require("morgan");
const path = require("path");
const http = require("http");

const socketio = require("socket.io");

var app = express();
var server = http.createServer(app);

app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Set public directory
app.use(express.static(path.join(__dirname, "public")));

const sockets = require("./sockets");
sockets.socketServer(app, server);

// Load routes
var indexRouter = require("./routes/index");
var createRouter = require("./routes/create");
var joinRouter = require("./routes/join");

// Delegate routes to paths
app.use("/", indexRouter);
app.use("/create", createRouter);
app.use("/join", joinRouter);

// Start server
server.listen(3000, function() {
    var port = server.address().port
    console.log("Server running on localhost:" + port)
});

