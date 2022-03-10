const mongoose = require('mongoose');

const { Schema } = mongoose;

const ActivitySchema = new Schema({
    userIDs: { type: [String], required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Activity', ActivitySchema)
