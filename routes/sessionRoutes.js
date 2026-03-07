const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSession,
  joinSession,
  updateSessionStatus,
  restartSession,
  deleteSession,
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// Public — student joins via session code
router.get('/join/:code', joinSession);

// Protected — teacher routes
router.post('/', protect, createSession);
router.get('/', protect, getSessions);
router.get('/:id', protect, getSession);
router.put('/:id/status', protect, updateSessionStatus);
router.put('/:id/restart', protect, restartSession);
router.delete('/:id', protect, deleteSession);

module.exports = router;
