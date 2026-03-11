const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionCode: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    activeQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

sessionSchema.index({ teacherId: 1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);
