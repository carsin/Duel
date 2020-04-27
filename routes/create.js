var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("create", {
        title: "Create Game",
    });
});

module.exports = router;

