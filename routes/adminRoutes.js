const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Vote = require('../models/Vote');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.delete('/questions/:id', protect, authorize(['admin']), async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    await Answer.deleteMany({ question: req.params.id });
    await Vote.deleteMany({ content_id: req.params.id, content_type: 'question' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/ban', protect, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = 'banned';
    await user.save();
    res.status(200).json({ message: `User ${user.username} banned successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;