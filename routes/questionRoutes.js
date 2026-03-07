const express = require('express');
const router = express.Router();
const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnswersBySession,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.get('/session/:sessionId/answers', protect, getAnswersBySession);

module.exports = router;
