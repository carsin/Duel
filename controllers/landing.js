exports.renderLanding= function(req, res, next) {
    res.render("landing", { title: "Fight" });
}

exports.submitUsername= function(req, res, next) {
    console.log("username: ", req.body.usernameInput)
    res.redirect("/play");
}
