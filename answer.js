const mongoose = require('mongoose');
const AnswerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Please add content for the answer']
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', 
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    author_username: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Answer', AnswerSchema);