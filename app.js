const express = require("express");
const logger = require("morgan");
const path = require("path");
const app = express();

app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

var indexRouter = require("./routes/index");
var createRouter = require("./routes/create");
var joinRouter = require("./routes/join");

app.use("/", indexRouter);
app.use("/create", createRouter);
app.use("/join", joinRouter);

var server = app.listen(3000, function() {
    var port = server.address().port
    console.log("Server running on localhost:" + port)
});
