const express = require("express");
const router  = express.Router();
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, (req, res) => {
  res.render("servers", { guilds: req.user.guilds });
});

module.exports = router;
