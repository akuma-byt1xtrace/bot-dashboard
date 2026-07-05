const mongoose = require("mongoose");

const GuildSettingsSchema = new mongoose.Schema({
  guildId:              { type: String, required: true, unique: true },
  welcome_enabled:      { type: Boolean, default: false },
  welcome_channel:      { type: String, default: "" },
  welcome_message:      { type: String, default: "" },
  verification_enabled: { type: Boolean, default: false },
  verify_channel:       { type: String, default: "" },
  verify_role:          { type: String, default: "" },
  verify_word:          { type: String, default: "verify" },
  verify_desc:          { type: String, default: "" },
  invites_enabled:      { type: Boolean, default: false },
  invite_log_channel:   { type: String, default: "" },
  fake_threshold:       { type: Number, default: 7 },
  count_rejoins:        { type: Boolean, default: false },
  count_fakes:          { type: Boolean, default: false },
  sticky_channel:       { type: String, default: "" },
  sticky_message:       { type: String, default: "" },
  modules_enabled:      { type: Number, default: 0 },
  autoreact_channel: { type: String, default: "" },
  autoreact_emojis:  { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema);
