const express = require('express');
const router = express.Router(); 
const Question = require('../models/question');
const Answer = require('../models/answer');
const { protect, authorize } = require('../middleware/auth');
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server Error: Could not fetch questions' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        question.views_count += 1;
        await question.save();
        const answers = await Answer.find({ question: req.params.id }).sort({ createdAt: 1 });
        res.status(200).json({ question, answers });
    } catch (error) {
        console.error('Error fetching single question:', error);
        res.status(500).json({ message: 'Server Error: Could not fetch question and answers' });
    }
});
router.post('/', protect, async (req, res) => {
    const { title, description, tags } = req.body; 
    if (!title || !description) {
        return res.status(400).json({ message: 'Please provide both title and description' });
    }
    try {
        const question = await Question.create({
            title,
            description,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []),
            user: req.user._id,
            author_username: req.user.username, 
        });
        res.status(201).json({ message: 'Question created successfully', question });
    } catch (error) {
        console.error('Error asking question:', error);
        res.status(500).json({ message: 'Server Error: Could not create question' });
    }
});
router.post('/:questionId/answers', protect, async (req, res) => {
    const { body } = req.body; 
    const { questionId } = req.params;

    if (!body) {
        return res.status(400).json({ message: 'Answer body cannot be empty' });
    }
    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answer = await Answer.create({
            body,
            question: questionId,
            user: req.user._id, 
            author_username: req.user.username, 
        });
        question.answers_count += 1;
        await question.save();
        res.status(201).json({ message: 'Answer posted successfully', answer });
    } catch (error) {
        console.error('Error posting answer:', error);
        res.status(500).json({ message: 'Server Error: Could not post answer' });
    }
});
router.put('/:questionId/accept-answer/:answerId', protect, async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        if (question.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized: You are not the owner of this question to accept an answer' });
        }
        const answer = await Answer.findById(req.params.answerId);
        if (!answer || answer.question.toString() !== question._id.toString()) {
            return res.status(404).json({ message: 'Answer not found for this question' });
        }
        question.accepted_answer = req.params.answerId;
        await question.save();

        res.status(200).json({ message: 'Answer accepted successfully', question });
    } catch (error) {
        console.error('Error accepting answer:', error);
        res.status(500).json({ message: 'Server Error: Could not accept answer' });
    }
});

module.exports = router;
