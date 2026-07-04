const express  = require("express");
const passport = require("passport");
const router   = express.Router();

router.get("/login", passport.authenticate("discord"));

router.get("/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    const returnTo = req.session.returnTo || "/dashboard";
    delete req.session.returnTo;
    res.redirect(returnTo);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
