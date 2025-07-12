const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content_type: { type: String, enum: ['question', 'answer'], required: true },
    content_id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    vote_type: { type: String, enum: ['up', 'down'], required: true },
    createdAt: { type: Date, default: Date.now }
});
VoteSchema.index({ user: 1, content_type: 1, content_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);