const crypto = require('crypto');
const Session = require('../models/Session');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// POST /api/sessions
const createSession = async (req, res) => {
  try {
    const sessionCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const session = await Session.create({
      teacherId: req.user._id,
      sessionCode,
      title: req.body.title,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ teacherId: req.user._id }).sort(
      '-createdAt'
    );
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sessions/:id
const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const questions = await Question.find({ sessionId: session._id }).sort(
      'questionOrder'
    );

    res.json({ session, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/sessions/join/:code
const joinSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      sessionCode: req.params.code,
      status: { $in: ['draft', 'active'] },
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: 'Session not found or already ended' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/sessions/:id/status
const updateSessionStatus = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/sessions/:id/restart
const restartSession = async (req, res) => {
  try {
    const sessionCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'draft', sessionCode, activeQuestion: null },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Clear old answers for this session
    await Answer.deleteMany({ sessionId: req.params.id });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/sessions/:id
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  joinSession,
  updateSessionStatus,
  restartSession,
  deleteSession,
};
