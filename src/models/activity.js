const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActivitySchema = new Schema({
  guildID: { type: String, required: true },
  channelID: { type: String, required: true },
  userIDs: { type: [String], required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Activity', ActivitySchema)
