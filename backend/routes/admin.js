// backend/routes/admin.js
const express = require('express');

const { 
  getUnansweredQuestions, 
  removeUnansweredQuestion, 
  addToKnowledgeBase,
  removeFromKnowledgeBase,
  getDynamicKnowledgeStats,
  clearUnansweredQuestions,
  getChatbotAnalytics,
  getChatbotEngine,
  // NEW: Persistence and Backup Functions
  exportKnowledgeBase,
  importKnowledgeBase,
  backupKnowledgeBase,
  restoreKnowledgeBase,
  getKnowledgeBaseFileInfo,
  resetKnowledgeBase,
  addKnowledgeBaseAnswerEnhanced
} = require('../utils/websiteLoader.js');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'rjcollege2024';
  
  if (username === adminUsername && password === adminPassword) {
    res.json({
      success: true,
      message: 'Login successful'
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});





// Get all unanswered questions
router.get('/unanswered-questions', (req, res) => {
  try {
    const questions = getUnansweredQuestions();
    
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

// Add answer to knowledge base - UPDATED with enhanced function
router.post('/add-answer', (req, res) => {
  try {
    const { question, answer, category } = req.body;
    
    if (!question || !answer) {
      return res.json({
        success: false,
        message: 'Question and answer are required'
      });
    }
    
    // Use the enhanced function that connects both systems
    const result = addKnowledgeBaseAnswerEnhanced(question, answer, category);
    
    res.json(result);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.json({
      success: false,
      message: 'Failed to add answer'
    });
  }
});

// Get dynamic knowledge base statistics
router.get('/knowledge-base/stats', (req, res) => {
  try {
    const stats = getDynamicKnowledgeStats();
    
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error getting knowledge base stats:', error);
    res.json({
      success: false,
      error: 'Failed to get knowledge base statistics'
    });
  }
});

// Remove from knowledge base
router.delete('/knowledge-base/:question', (req, res) => {
  try {
    const { question } = req.params;
    const decodedQuestion = decodeURIComponent(question);
    
    const result = removeFromKnowledgeBase(decodedQuestion);
    
    res.json(result);
  } catch (error) {
    console.error('Error removing from knowledge base:', error);
    res.json({
      success: false,
      message: 'Failed to remove from knowledge base'
    });
  }
});

// Remove unanswered question
router.delete('/unanswered-questions/:question', (req, res) => {
  try {
    const { question } = req.params;
    const decodedQuestion = decodeURIComponent(question);
    
    const result = removeUnansweredQuestion(decodedQuestion);
    
    if (result) {
      res.json({
        success: true,
        message: 'Question removed successfully',
        removedQuestion: result
      });
    } else {
      res.json({
        success: false,
        message: 'Question not found'
      });
    }
  } catch (error) {
    console.error('Error removing question:', error);
    res.json({
      success: false,
      message: 'Failed to remove question'
    });
  }
});

// Clear all unanswered questions
router.delete('/unanswered-questions', (req, res) => {
  try {
    const count = clearUnansweredQuestions();
    
    res.json({
      success: true,
      message: `Cleared ${count} unanswered questions`,
      clearedCount: count
    });
  } catch (error) {
    console.error('Error clearing questions:', error);
    res.json({
      success: false,
      message: 'Failed to clear questions'
    });
  }
});

// Get chatbot analytics
router.get('/analytics', (req, res) => {
  try {
    const analytics = getChatbotAnalytics();
    
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

// Get system health
router.get('/health', (req, res) => {
  try {
    const chatbot = getChatbotEngine();
    const health = chatbot.getSystemHealth();
    
    res.json({
      success: true,
      health: health
    });
  } catch (error) {
    console.error('Error getting system health:', error);
    res.json({
      success: false,
      error: 'Failed to get system health'
    });
  }
});

// ========== NEW: KNOWLEDGE BASE PERSISTENCE & BACKUP ROUTES ==========

// Get knowledge base file information
router.get('/knowledge-base/file-info', (req, res) => {
  try {
    const fileInfo = getKnowledgeBaseFileInfo();
    res.json({
      success: true,
      fileInfo: fileInfo
    });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.json({
      success: false,
      error: 'Failed to get file information'
    });
  }
});

// Backup knowledge base
router.post('/knowledge-base/backup', (req, res) => {
  try {
    const result = backupKnowledgeBase();
    res.json(result);
  } catch (error) {
    console.error('Error backing up knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to backup knowledge base'
    });
  }
});

// Restore knowledge base from backup
router.post('/knowledge-base/restore', (req, res) => {
  try {
    const result = restoreKnowledgeBase();
    res.json(result);
  } catch (error) {
    console.error('Error restoring knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to restore knowledge base'
    });
  }
});

// Reset knowledge base (clear all dynamic answers)
router.post('/knowledge-base/reset', (req, res) => {
  try {
    const result = resetKnowledgeBase();
    res.json(result);
  } catch (error) {
    console.error('Error resetting knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to reset knowledge base'
    });
  }
});

// Export knowledge base data
router.get('/knowledge-base/export', (req, res) => {
  try {
    const data = exportKnowledgeBase();
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error exporting knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to export knowledge base'
    });
  }
});

// Import knowledge base data
router.post('/knowledge-base/import', (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.json({
        success: false,
        message: 'Import data is required'
      });
    }
    
    const result = importKnowledgeBase(data);
    res.json(result);
  } catch (error) {
    console.error('Error importing knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to import knowledge base'
    });
  }
});

// Get comprehensive knowledge base management info
router.get('/knowledge-base/management', (req, res) => {
  try {
    const stats = getDynamicKnowledgeStats();
    const fileInfo = getKnowledgeBaseFileInfo();
    const analytics = getChatbotAnalytics();
    
    res.json({
      success: true,
      management: {
        stats: stats,
        fileInfo: fileInfo,
        analytics: analytics.dynamicKnowledgeStats,
        totalUnanswered: analytics.unansweredQuestions ? analytics.unansweredQuestions.length : 0
      }
    });
  } catch (error) {
    console.error('Error getting management info:', error);
    res.json({
      success: false,
      error: 'Failed to get management information'
    });
  }
});

// Bulk add answers to knowledge base
router.post('/knowledge-base/bulk-add', (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.json({
        success: false,
        message: 'Answers array is required'
      });
    }
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Process each answer
    for (const answer of answers) {
      try {
        if (answer.question && answer.answer) {
          const result = addToKnowledgeBase(
            answer.question, 
            answer.answer, 
            answer.category || 'general'
          );
          
          if (result.success) {
            successCount++;
            // Remove from unanswered questions if it exists there
            removeUnansweredQuestion(answer.question);
          }
          
          results.push({
            question: answer.question,
            success: result.success,
            message: result.message
          });
        } else {
          errorCount++;
          results.push({
            question: answer.question || 'Unknown',
            success: false,
            message: 'Question and answer are required'
          });
        }
      } catch (error) {
        errorCount++;
        results.push({
          question: answer.question || 'Unknown',
          success: false,
          message: 'Error processing answer'
        });
      }
    }
    
    res.json({
      success: true,
      message: `Processed ${answers.length} answers`,
      summary: {
        total: answers.length,
        success: successCount,
        errors: errorCount
      },
      results: results
    });
  } catch (error) {
    console.error('Error in bulk add:', error);
    res.json({
      success: false,
      error: 'Failed to process bulk add'
    });
  }
});

// Search knowledge base
router.get('/knowledge-base/search', (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const stats = getDynamicKnowledgeStats();
    const searchTerm = query.toLowerCase();
    
    // Search through knowledge base
    const searchResults = [];
    if (stats.mostUsed && Array.isArray(stats.mostUsed)) {
      stats.mostUsed.forEach(item => {
        if (item.question.toLowerCase().includes(searchTerm) || 
            item.answer.toLowerCase().includes(searchTerm) ||
            (item.category && item.category.toLowerCase().includes(searchTerm))) {
          searchResults.push(item);
        }
      });
    }
    
    res.json({
      success: true,
      query: query,
      results: searchResults,
      count: searchResults.length
    });
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    res.json({
      success: false,
      error: 'Failed to search knowledge base'
    });
  }
});

// Get knowledge base by category
router.get('/knowledge-base/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    
    const stats = getDynamicKnowledgeStats();
    const categoryResults = [];
    
    if (stats.mostUsed && Array.isArray(stats.mostUsed)) {
      stats.mostUsed.forEach(item => {
        if (item.category === category) {
          categoryResults.push(item);
        }
      });
    }
    
    res.json({
      success: true,
      category: category,
      results: categoryResults,
      count: categoryResults.length
    });
  } catch (error) {
    console.error('Error getting category results:', error);
    res.json({
      success: false,
      error: 'Failed to get category results'
    });
  }
});

module.exports = router;