// backend/models/AdminModel.js
const mongoose = require('mongoose');

const unansweredQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  originalQuestion: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    default: 'unknown'
  },
  confidence: {
    type: Number,
    default: 0
  },
  context: {
    type: Object,
    default: {}
  },
  userIP: {
    type: String,
    default: 'unknown'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'added', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

const knowledgeBaseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    unique: true
  },
  questionVariations: [String],
  answer: {
    type: String,
    required: true
  },
  intent: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  entities: {
    type: Object,
    default: {}
  },
  confidenceThreshold: {
    type: Number,
    default: 0.7
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  usageCount: {
    type: Number,
    default: 0
  },
  tags: [String]
});

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'support'],
    default: 'support'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  permissions: {
    canManageKB: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: true }
  }
});

const UnansweredQuestion = mongoose.model('UnansweredQuestion', unansweredQuestionSchema);
const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = {
  UnansweredQuestion,
  KnowledgeBase,
  AdminUser
};