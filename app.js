const express = require("express");
const logger = require("morgan");
const path = require("path");
const http = require("http");

var app = express();
var server = http.createServer(app);

// app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Enable body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// Set public directory
app.use(express.static(path.join(__dirname, "public")));

// Set up sockets
const sockets = require("./sockets");
sockets.socketServer(app, server);

// Set up route
var indexRouter = require("./routes/index");
app.use("/", indexRouter);

// Start server
server.listen(3000, function() {
    var port = server.address().port
    console.log("Server running on localhost:" + port)
});

