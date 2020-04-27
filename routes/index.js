var express = require("express");
var router = express.Router();

var landing = require("../controllers/landing");

router.get("/", landing.renderLanding);
router.post("/", landing.startGame);

module.exports = router;
