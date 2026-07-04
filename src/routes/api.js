const express = require("express");
const router  = express.Router();
const { isAuthenticatedApi } = require("../middleware/auth");
const GuildSettings = require("../models/GuildSettings");

// Health check
router.get("/ping", (req, res) => res.json({ status: "ok" }));

// Save guild settings
router.post("/guild/:guildId/settings", isAuthenticatedApi, async (req, res) => {
  const { guildId } = req.params;

  // Make sure user manages this guild
  const guild = req.user.guilds.find(g => g.id === guildId);
  if (!guild) return res.status(403).json({ error: "Forbidden" });

  try {
    await GuildSettings.findOneAndUpdate(
      { guildId },
      { $set: req.body },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
});

// Get guild settings
router.get("/guild/:guildId/settings", isAuthenticatedApi, async (req, res) => {
  const { guildId } = req.params;

  const guild = req.user.guilds.find(g => g.id === guildId);
  if (!guild) return res.status(403).json({ error: "Forbidden" });

  try {
    const settings = await GuildSettings.findOne({ guildId });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to load" });
  }
});

module.exports = router;
