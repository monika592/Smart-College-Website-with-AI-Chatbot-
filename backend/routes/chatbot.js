// backend/routes/chatbot.js
const express = require('express');
const { findRelevantAnswers, getChatbotEngine } = require('../utils/websiteLoader.js');

const router = express.Router();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.json({
        success: true,
        answer: "👋 Hello! I'm the RJ College Assistant. How can I help you with information about Ramniranjan Jhunjhunwala College today?"
      });
    }
    
    const cleanedQuestion = question.trim();
    console.log(`🤔 Question: "${cleanedQuestion}"`);
    
    const result = findRelevantAnswers(cleanedQuestion);
    
    res.json({
      success: true,
      answer: result.answer,
      confidence: result.confidence
    });
    
  } catch (error) {
    console.error('Chatbot error:', error);
    res.json({
      success: true,
      answer: "I'm here to help you with information about RJ College! I can tell you about academic departments, courses, admissions, principal information, and more. What would you like to know?"
    });
  }
});

// Status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    name: "RJ College Chatbot",
    status: "Active and Ready",
    version: "1.0",
    capabilities: [
      "Provide principal and leadership information",
      "List all academic departments and courses",
      "Explain admission procedures",
      "Share contact and location details", 
      "Provide general college information"
    ]
  });
});

// Unanswered questions endpoint - CORRECTED PLACEMENT
router.get('/unanswered-questions', (req, res) => {
  try {
    const chatbot = getChatbotEngine();
    const questions = chatbot.getUnansweredQuestions();
    
    res.json({
      success: true,
      questions: questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Error getting unanswered questions:', error);
    res.json({
      success: false,
      error: 'Failed to get unanswered questions',
      questions: [],
      count: 0
    });
  }
});

// Analytics endpoint
router.get('/analytics', (req, res) => {
  try {
    const chatbot = getChatbotEngine();
    const analytics = chatbot.analyzeConversationPatterns();
    
    res.json({
      success: true,
      analytics: analytics
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.json({
      success: false,
      error: 'Failed to get analytics'
    });
  }
});

// Conversation history endpoint
router.get('/conversation-history', (req, res) => {
  try {
    const chatbot = getChatbotEngine();
    const history = chatbot.getConversationHistory();
    
    res.json({
      success: true,
      history: history,
      count: history.length
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.json({
      success: false,
      error: 'Failed to get conversation history'
    });
  }
});

module.exports = router;