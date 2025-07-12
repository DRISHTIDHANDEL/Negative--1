const express = require('express');
const Vote = require('../Models/vote');
const Question = require('../models/Question'); 
const Answer = require('../models/Answer'); 
const { protect } = require('../middleware/auth');

const router = express.Router();
router.post('/', protect, async (req, res) => {
    const { content_type, content_id, vote_type } = req.body;
    const userId = req.user._id;
    try {
        let existingVote = await Vote.findOne({ user: userId, content_type, content_id });
        if (existingVote) {
            if (existingVote.vote_type === vote_type) {
                await existingVote.deleteOne();
                res.status(200).json({ message: 'Vote removed' });
            } else {
                existingVote.vote_type = vote_type;
                await existingVote.save();
                res.status(200).json({ message: 'Vote changed' });
            }
        } else {
            await Vote.create({ user: userId, content_type, content_id, vote_type });
            res.status(201).json({ message: 'Vote recorded' });
        }
        const votesForContent = await Vote.find({ content_type, content_id });
        let newVoteCount = 0;
        votesForContent.forEach(vote => {
            if (vote.vote_type === 'up') newVoteCount++;
            else if (vote.vote_type === 'down') newVoteCount--;
        });
        if (content_type === 'question') {
            await Question.findByIdAndUpdate(content_id, { votes_count: newVoteCount });
        } else if (content_type === 'answer') {
            await Answer.findByIdAndUpdate(content_id, { votes_count: newVoteCount });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
});

module.exports = router;