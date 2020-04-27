const express = require("express");
const logger = require("morgan");
const path = require("path");
const http = require("http");

var app = express();
var server = http.createServer(app);
var socketio = require("socket.io");

app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Set public directory
app.use(express.static(path.join(__dirname, "public")));

// Load routes
var indexRouter = require("./routes/index");
var createRouter = require("./routes/create");
var joinRouter = require("./routes/join");

// Delegate routes to paths
app.use("/", indexRouter);
app.use("/create", createRouter);
app.use("/join", joinRouter);

// IO
var io = socketio(server);

io.on("connection", function(socket) {
    console.log("user connected");

    socket.on("disconnect", function() {
        console.log("user disconnected");
    });
});

server.listen(3000, function() {
    var port = server.address().port
    console.log("Server running on localhost:" + port)
});
