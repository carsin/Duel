var express = require("express");
var router = express.Router();
var hri = require("human-readable-ids").hri;

router.get("/", function(req, res) {
    res.render("index");
});

module.exports = router;
