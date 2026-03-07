const Question = require('../models/Question');
const Answer = require('../models/Answer');

// POST /api/questions
const createQuestion = async (req, res) => {
  try {
    const { sessionId, questionText, questionOrder } = req.body;

    const question = await Question.create({
      sessionId,
      questionText,
      questionOrder,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/questions/:id
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/questions/session/:sessionId/answers
const getAnswersBySession = async (req, res) => {
  try {
    const answers = await Answer.find({
      sessionId: req.params.sessionId,
    }).populate('questionId', 'questionText questionOrder');

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAnswersBySession,
};
