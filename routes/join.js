var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("join", {
        title: "Join Game",
    });
});

module.exports = router;

