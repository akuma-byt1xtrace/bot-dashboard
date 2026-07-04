const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const { isAuthenticated } = require("../middleware/auth");
const GuildSettings = require("../models/GuildSettings");

// Server selector
router.get("/", isAuthenticated, (req, res) => {
  res.render("servers", { guilds: req.user.guilds });
});

// Guild dashboard
router.get("/:guildId", isAuthenticated, async (req, res) => {
  const { guildId } = req.params;

  // Check user manages this guild
  const guild = req.user.guilds.find(g => g.id === guildId);
  if (!guild) return res.redirect("/dashboard");

  try {
    // Fetch channels and roles from Discord
    const headers = { Authorization: `Bot ${process.env.BOT_TOKEN}` };
    const [channelsRes, rolesRes] = await Promise.all([
      axios.get(`https://discord.com/api/v10/guilds/${guildId}/channels`, { headers }),
      axios.get(`https://discord.com/api/v10/guilds/${guildId}/roles`, { headers }),
    ]);

    // Load or create settings from MongoDB
    let settings = await GuildSettings.findOne({ guildId });
    if (!settings) settings = new GuildSettings({ guildId });

    res.render("dashboard", {
      guild,
      channels: channelsRes.data,
      roles:    rolesRes.data,
      settings: settings.toObject(),
    });
  } catch (err) {
    console.error(err.message);
    res.redirect("/dashboard");
  }
});

module.exports = router;
