var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.render("create", {
        title: "Create Game",
    });
});

router.post("/", function(req, res, next) {
    console.log("game created by " + req.body.usernameInput);
    res.redirect("/");
});

module.exports = router;

