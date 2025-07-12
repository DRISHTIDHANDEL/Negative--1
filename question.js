const mongoose = require('mongoose');
const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the question'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the question']
    },
    tags: {
        type: [String], 
        default: []
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
    views_count: {
        type: Number,
        default: 0
    },
    answers_count: {
        type: Number,
        default: 0
    },
    accepted_answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Answer', 
        default: null 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);