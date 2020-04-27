var express = require("express");
var app = express();

var indexRouter = require("./routes/index.js");

app.use("/", indexRouter);

var server = app.listen("3000", function() {
    console.log("Server started on port 3000");
});
