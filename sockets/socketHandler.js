const Session = require('../models/Session');
const Answer = require('../models/Answer');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Student joins a session room
    socket.on('join-session', (sessionCode) => {
      socket.join(sessionCode);
      console.log(`Socket ${socket.id} joined session ${sessionCode}`);
    });

    // Teacher sends next question to all students
    socket.on('next-question', ({ sessionCode, question }) => {
      io.to(sessionCode).emit('new-question', question);
    });

    // Student submits an answer
    socket.on('submit-answer', async ({ sessionId, questionId, answerText }) => {
      try {
        const answer = await Answer.create({
          sessionId,
          questionId,
          answerText,
        });
        // Notify teacher that a new answer was received
        io.to(sessionId).emit('answer-received', answer);
      } catch (error) {
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // Teacher ends the session
    socket.on('end-session', async ({ sessionCode, sessionId }) => {
      try {
        await Session.findByIdAndUpdate(sessionId, { status: 'completed' });
        io.to(sessionCode).emit('session-ended');
      } catch (error) {
        socket.emit('error', { message: 'Failed to end session' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
