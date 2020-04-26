exports.renderLanding= function(req, res, next) {
    res.render("landing", { title: "Fight" });
}

exports.submitUsername= function(req, res, next) {
    if (req.body.usernameInput.length == 0) {
        res.send("username too short");
        res.redirect("/");
    }

    console.log("username: ", req.body.usernameInput)
    res.redirect("/play");
}
