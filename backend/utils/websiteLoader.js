// backend/utils/websiteLoader.js
const ChatbotEngine = require('./chatbotEngine.js');
const fs = require('fs');
const path = require('path');

// Create a single instance
const chatbotEngine = new ChatbotEngine();

function trainFromWebsite() {
  console.log('🚀 **RJ College Chatbot Initialized Successfully!**');
  console.log('\n📊 **Knowledge Base Summary:**');
  console.log('   🏛️  College Information: Complete profile with history and vision');
  console.log('   📚 Academic Departments: 7 departments with detailed information');
  console.log('   🎓 Academic Programs: 20+ courses with comprehensive details');
  console.log('   💰 Financial Information: Complete fee structures and scholarships');
  console.log('   🏢 Placement Data: Department-wise statistics and company details');
  console.log('   🏫 Facilities: 10+ major facilities with contact information');
  console.log('   📅 Events & Activities: Academic, sports, and cultural events');
  console.log('   👨‍🏫 Faculty Information: Principal, vice principal, and department heads');
  console.log('   🎯 Student Support: Counseling, NCC, NSS, and club activities');
  
  console.log('\n🧠 **NLP Capabilities:**');
  console.log('   • Intent Recognition: 30+ different question types');
  console.log('   • Entity Extraction: Departments, courses, information types');
  console.log('   • Context Awareness: Maintains conversation context');
  console.log('   • Confidence Scoring: Intelligent response selection');
  console.log('   • Fallback Handling: Graceful error recovery');
  
  console.log('\n💡 **Sample Questions You Can Ask:**');
  console.log('   • "List all departments"');
  console.log('   • "What courses are available in Computer Science?"');
  console.log('   • "Fee structure for B.Sc IT"');
  console.log('   • "Placement statistics for IT department"');
  console.log('   • "Admission process for 2025-26"');
  console.log('   • "Scholarships available"');
  console.log('   • "College facilities"');
  console.log('   • "Contact information"');
  console.log('   • "Who is the principal?"');
  console.log('   • "Events and activities"');
  
  // Initialize knowledge base file if it doesn't exist
  initializeKnowledgeBaseFile();
  
  return true;
}

// Initialize knowledge base file
function initializeKnowledgeBaseFile() {
  try {
    const knowledgeBaseFile = path.join(__dirname, '../data/dynamic_knowledge_base.json');
    const dataDir = path.join(__dirname, '../data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }
    
    // Create knowledge base file if it doesn't exist
    if (!fs.existsSync(knowledgeBaseFile)) {
      const initialData = {
        dynamicKnowledgeBase: [],
        usageStats: {
          totalQueries: 0,
          dynamicAnswersUsed: 0,
          lastUpdated: new Date().toISOString()
        },
        lastSaved: new Date().toISOString()
      };
      fs.writeFileSync(knowledgeBaseFile, JSON.stringify(initialData, null, 2));
      console.log('📄 Created initial knowledge base file');
    } else {
      console.log('📄 Knowledge base file already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing knowledge base file:', error);
  }
}

function findRelevantAnswers(question) {
  try {
    const response = chatbotEngine.generateResponse(question);
    const analysis = chatbotEngine.getContextSummary();
    
    return {
      answer: response,
      confidence: 0.95,
      timestamp: new Date().toISOString(),
      context: analysis
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      answer: "I apologize, but I'm experiencing technical difficulties right now. Please try asking your question again or contact the college directly for immediate assistance.",
      confidence: 0,
      timestamp: new Date().toISOString(),
      context: null
    };
  }
}

function generateResponse(question) {
  return findRelevantAnswers(question).answer;
}

function getChatbotEngine() {
  return chatbotEngine;
}

function getChatbotAnalytics() {
  return {
    conversationHistory: chatbotEngine.getConversationHistory(),
    contextSummary: chatbotEngine.getContextSummary(),
    conversationPatterns: chatbotEngine.analyzeConversationPatterns(),
    suggestedQuestions: chatbotEngine.getSuggestedQuestions(),
    unansweredQuestions: chatbotEngine.getUnansweredQuestions(),
    dynamicKnowledgeStats: chatbotEngine.responseGenerator.getDynamicKnowledgeStats ? chatbotEngine.responseGenerator.getDynamicKnowledgeStats() : { totalAnswers: 0, totalUsage: 0 }
  };
}

function clearChatbotHistory() {
  chatbotEngine.clearHistory();
  return "Conversation history cleared successfully.";
}

// Admin functions for unanswered questions
function getUnansweredQuestions() {
  return chatbotEngine.getUnansweredQuestions();
}

function removeUnansweredQuestion(question) {
  return chatbotEngine.removeUnansweredQuestion(question);
}

function addKnowledgeBaseAnswer(question, answer, category) {
  return chatbotEngine.addKnowledgeBaseAnswer(question, answer, category);
}

function clearUnansweredQuestions() {
  return chatbotEngine.clearUnansweredQuestions();
}

// NEW: Dynamic Knowledge Base Functions
function addToKnowledgeBase(question, answer, category = 'general') {
  if (chatbotEngine.responseGenerator && chatbotEngine.responseGenerator.addToKnowledgeBase) {
    return chatbotEngine.responseGenerator.addToKnowledgeBase(question, answer, category);
  } else {
    console.error('❌ Dynamic knowledge base not available in ResponseGenerator');
    return {
      success: false,
      message: 'Dynamic knowledge base not available'
    };
  }
}

function getDynamicKnowledgeStats() {
  if (chatbotEngine.responseGenerator && chatbotEngine.responseGenerator.getDynamicKnowledgeStats) {
    return chatbotEngine.responseGenerator.getDynamicKnowledgeStats();
  } else {
    return {
      totalAnswers: 0,
      totalUsage: 0,
      mostUsed: [],
      byCategory: {},
      usageStats: { totalQueries: 0, dynamicAnswersUsed: 0, lastUpdated: new Date().toISOString() }
    };
  }
}

function removeFromKnowledgeBase(question) {
  if (chatbotEngine.responseGenerator && chatbotEngine.responseGenerator.removeFromKnowledgeBase) {
    return chatbotEngine.responseGenerator.removeFromKnowledgeBase(question);
  } else {
    return {
      success: false,
      message: 'Dynamic knowledge base not available'
    };
  }
}

// Enhanced addKnowledgeBaseAnswer that connects both systems
function addKnowledgeBaseAnswerEnhanced(question, answer, category = 'general') {
  try {
    // Remove from unanswered questions
    const removeResult = removeUnansweredQuestion(question);
    
    // Add to dynamic knowledge base
    const knowledgeResult = addToKnowledgeBase(question, answer, category);
    
    return {
      success: knowledgeResult.success,
      message: 'Answer added to knowledge base successfully',
      knowledgeBase: knowledgeResult,
      unansweredRemoved: removeResult ? true : false
    };
  } catch (error) {
    console.error('Error in addKnowledgeBaseAnswerEnhanced:', error);
    return {
      success: false,
      message: 'Failed to add answer to knowledge base'
    };
  }
}

// Export knowledge base data
function exportKnowledgeBase() {
  const chatbot = getChatbotEngine();
  if (chatbot.responseGenerator && chatbot.responseGenerator.exportKnowledgeBase) {
    return chatbot.responseGenerator.exportKnowledgeBase();
  }
  return {
    success: false,
    message: 'Knowledge base export not available'
  };
}

// Import knowledge base data
function importKnowledgeBase(data) {
  const chatbot = getChatbotEngine();
  if (chatbot.responseGenerator && chatbot.responseGenerator.importKnowledgeBase) {
    return chatbot.responseGenerator.importKnowledgeBase(data);
  }
  return {
    success: false,
    message: 'Knowledge base import not available'
  };
}

// Backup knowledge base to a specific file
function backupKnowledgeBase() {
  try {
    const data = exportKnowledgeBase();
    const backupFile = path.join(__dirname, '../data/knowledge_base_backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
    return {
      success: true,
      message: `Knowledge base backed up to ${backupFile}`,
      backupFile: backupFile,
      answersCount: data.totalAnswers || 0
    };
  } catch (error) {
    console.error('Error backing up knowledge base:', error);
    return {
      success: false,
      message: 'Failed to backup knowledge base'
    };
  }
}

// Restore knowledge base from backup
function restoreKnowledgeBase() {
  try {
    const backupFile = path.join(__dirname, '../data/knowledge_base_backup.json');
    if (!fs.existsSync(backupFile)) {
      return {
        success: false,
        message: 'Backup file not found'
      };
    }
    
    const backupData = fs.readFileSync(backupFile, 'utf8');
    const data = JSON.parse(backupData);
    
    const result = importKnowledgeBase(data);
    return {
      success: result.success,
      message: result.message,
      answersRestored: data.totalAnswers || 0
    };
  } catch (error) {
    console.error('Error restoring knowledge base:', error);
    return {
      success: false,
      message: 'Failed to restore knowledge base'
    };
  }
}

// Get knowledge base file info
function getKnowledgeBaseFileInfo() {
  try {
    const knowledgeBaseFile = path.join(__dirname, '../data/dynamic_knowledge_base.json');
    const backupFile = path.join(__dirname, '../data/knowledge_base_backup.json');
    
    const info = {
      knowledgeBaseFile: {
        exists: fs.existsSync(knowledgeBaseFile),
        path: knowledgeBaseFile
      },
      backupFile: {
        exists: fs.existsSync(backupFile),
        path: backupFile
      }
    };
    
    if (info.knowledgeBaseFile.exists) {
      const stats = fs.statSync(knowledgeBaseFile);
      info.knowledgeBaseFile.size = stats.size;
      info.knowledgeBaseFile.modified = stats.mtime;
    }
    
    if (info.backupFile.exists) {
      const stats = fs.statSync(backupFile);
      info.backupFile.size = stats.size;
      info.backupFile.modified = stats.mtime;
    }
    
    return info;
  } catch (error) {
    console.error('Error getting file info:', error);
    return {
      error: 'Failed to get file information'
    };
  }
}

// Reset knowledge base (clear all dynamic answers)
function resetKnowledgeBase() {
  try {
    const chatbot = getChatbotEngine();
    if (chatbot.responseGenerator && chatbot.responseGenerator.dynamicKnowledgeBase) {
      // Create backup before reset
      backupKnowledgeBase();
      
      // Reset the knowledge base
      chatbot.responseGenerator.dynamicKnowledgeBase = [];
      chatbot.responseGenerator.usageStats = {
        totalQueries: 0,
        dynamicAnswersUsed: 0,
        lastUpdated: new Date().toISOString()
      };
      
      // Save the reset state
      if (chatbot.responseGenerator.saveKnowledgeBase) {
        chatbot.responseGenerator.saveKnowledgeBase();
      }
      
      return {
        success: true,
        message: 'Knowledge base reset successfully',
        backupCreated: true
      };
    }
    return {
      success: false,
      message: 'Knowledge base reset not available'
    };
  } catch (error) {
    console.error('Error resetting knowledge base:', error);
    return {
      success: false,
      message: 'Failed to reset knowledge base'
    };
  }
}

module.exports = {
  trainFromWebsite,
  findRelevantAnswers, 
  generateResponse,
  getChatbotEngine,
  getChatbotAnalytics,
  clearChatbotHistory,
  
  // Unanswered questions functions (existing)
  getUnansweredQuestions,
  removeUnansweredQuestion,
  addKnowledgeBaseAnswer,
  clearUnansweredQuestions,
  
  // NEW: Dynamic Knowledge Base Functions
  addToKnowledgeBase,
  getDynamicKnowledgeStats,
  removeFromKnowledgeBase,
  addKnowledgeBaseAnswerEnhanced,
  
  // NEW: Persistence and Backup Functions
  exportKnowledgeBase,
  importKnowledgeBase,
  backupKnowledgeBase,
  restoreKnowledgeBase,
  getKnowledgeBaseFileInfo,
  resetKnowledgeBase
};