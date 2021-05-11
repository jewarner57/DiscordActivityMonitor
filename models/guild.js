const mongoose = require('mongoose');

const { Schema } = mongoose;

const GuildSchema = new Schema({
  guildID: { type: String, required: true },
  homechannel: { type: String, required: false },
  alertrole: { type: String, required: false },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Guild', GuildSchema)
