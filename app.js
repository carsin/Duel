const express = require("express");
const logger = require("morgan");
const path = require("path");
const app = express();

app.use(logger("dev"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const indexRouter = require("./routes/index.js");

app.use("/", indexRouter);

var server = app.listen(3000, function() {
    var port = server.address().port

    console.log("Server running on localhost:" + port)
});
