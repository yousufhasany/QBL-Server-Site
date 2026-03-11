const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answerText: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

answerSchema.index({ sessionId: 1, questionId: 1 });

// No student identity stored — answers are anonymous
module.exports = mongoose.model('Answer', answerSchema);
