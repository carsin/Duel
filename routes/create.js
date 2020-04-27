var express = require("express");
var router = express.Router();
var hri = require("human-readable-ids").hri;

router.get("/", function(req, res, next) {
    res.render("create", {
        title: "Create Game",
    });
});

router.post("/", function(req, res, next) {
    console.log(req.body.selectedGame + " game created by " + req.body.usernameInput);
    console.log("generating game with ID: " + hri.random());
    res.redirect("/");
});

module.exports = router;

