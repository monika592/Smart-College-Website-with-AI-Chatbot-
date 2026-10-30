// backend/models/unanswered.js
const mongoose = require('mongoose');

const unansweredQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  pageContext: {
    type: String,
    default: ''
  },
  attempted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('UnansweredQuestion', unansweredQuestionSchema);