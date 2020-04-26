var express = require("express");
var router = express.Router();

var play = require("../controllers/play");

/* GET home page. */
router.get("/", play.renderGame);

module.exports = router;

