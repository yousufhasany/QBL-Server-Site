const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    questionOrder: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ sessionId: 1, questionOrder: 1 });

module.exports = mongoose.model('Question', questionSchema);
