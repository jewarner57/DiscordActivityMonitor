const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
  guildID: { type: String, required: true },
  homechannel: { type: String, required: true },
  alertrole: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("Guild", GuildSchema);