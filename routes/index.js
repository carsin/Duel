var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("index", {
        title: "Duel",
    });
});

router.post("joinGameRedirect", function(req, res) {
    return res.redirect("/join")
});

module.exports = router;
