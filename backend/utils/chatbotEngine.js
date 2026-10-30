// backend/utils/chatbotEngine.js
const ResponseGenerator = require('./responseGenerator.js');
const NLPProcessor = require('./nlpProcessor.js');

class ChatbotEngine {
  constructor() {
    this.responseGenerator = new ResponseGenerator();
    this.nlpProcessor = new NLPProcessor();
    this.conversationHistory = [];
    this.unansweredQuestions = [];
    this.userContext = {
      lastDepartment: null,
      lastCourse: null,
      lastIntent: null,
      preferences: {
        courseLevel: null,
        interestArea: null,
        queryType: null
      }
    };
    
    // Admin notification settings
    this.adminSettings = {
      notifyOnUnanswered: true,
      maxUnansweredQuestions: 50,
      autoClearOldQuestions: true
    };
  }

  generateResponse(question) {
    try {
      // Input validation
      if (!question || typeof question !== 'string') {
        throw new Error('Question must be a non-empty string');
      }
      
      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length === 0) {
        return "Please ask a question about Ramniranjan Jhunjhunwala College. I'm here to help!";
      }
      
      // Check for very long questions
      if (trimmedQuestion.length > 500) {
        return "Your question seems quite long. Could you please ask a shorter, more specific question about the college?";
      }

      console.log(`\n🤔 User Question: "${trimmedQuestion}"`);
      
      // Process with NLP first for better intent detection
      const nlpResult = this.nlpProcessor.processQuestion(trimmedQuestion);
      console.log(`🎯 NLP Result:`, {
        intent: nlpResult.intent,
        confidence: nlpResult.confidence,
        department: nlpResult.department,
        course: nlpResult.course
      });
      
      // Update user context based on question and NLP results
      this.updateUserContext(trimmedQuestion, nlpResult);
      
      // Generate response
      const response = this.responseGenerator.generateResponse(trimmedQuestion);
      
      // Check if it's a fallback response (low confidence or unknown intent)
      const isFallback = this.isFallbackResponse(response, nlpResult);
      
      if (isFallback && this.adminSettings.notifyOnUnanswered) {
        // Store unanswered question for admin review
        this.storeUnansweredQuestion(trimmedQuestion, nlpResult);
      }
      
      // Store conversation history with enhanced context
      this.conversationHistory.push({
        question: trimmedQuestion,
        response: response.substring(0, 200) + (response.length > 200 ? '...' : ''),
        timestamp: new Date().toISOString(),
        context: { ...this.userContext },
        nlpData: {
          intent: nlpResult.intent,
          confidence: nlpResult.confidence,
          entities: nlpResult.entities
        },
        intent: this.responseGenerator.lastIntent,
        isFallback: isFallback,
        responseLength: response.length
      });
      
      // Keep only last 15 conversations
      if (this.conversationHistory.length > 15) {
        this.conversationHistory.shift();
      }
      
      // Clean up old unanswered questions if needed
      if (this.adminSettings.autoClearOldQuestions) {
        this.cleanupOldUnansweredQuestions();
      }
      
      console.log(`✅ Generated ${response.length} character response`);
      console.log(`📊 Context:`, this.userContext);
      console.log(`❓ Unanswered Questions: ${this.unansweredQuestions.length}`);
      
      return response;
      
    } catch (error) {
      console.error('❌ Error generating response:', error);
      this.storeUnansweredQuestion(question, { intent: 'ERROR', confidence: 0 });
      return this.getContextualFallbackResponse();
    }
  }

  isFallbackResponse(response, nlpResult) {
    const fallbackIndicators = [
      "I'm not sure",
      "I apologize",
      "trouble understanding",
      "having trouble processing",
      "not sure I understood"
    ];
    
    const isFallbackText = fallbackIndicators.some(indicator => 
      response.toLowerCase().includes(indicator.toLowerCase())
    );
    
    const isLowConfidence = nlpResult.confidence < 0.5;
    const isUnknownIntent = nlpResult.intent === 'unknown';
    
    return isFallbackText || isLowConfidence || isUnknownIntent;
  }

  storeUnansweredQuestion(question, nlpResult = {}) {
    // Check if question already exists (case insensitive)
    const existingQuestion = this.unansweredQuestions.find(
      q => q.question.toLowerCase() === question.toLowerCase()
    );
    
    if (!existingQuestion) {
      // Check if we've reached the maximum limit
      if (this.unansweredQuestions.length >= this.adminSettings.maxUnansweredQuestions) {
        // Remove the oldest question to make space
        this.unansweredQuestions.shift();
      }
      
      this.unansweredQuestions.push({
        question,
        timestamp: new Date().toISOString(),
        context: { ...this.userContext },
        nlpData: {
          intent: nlpResult.intent || 'unknown',
          confidence: nlpResult.confidence || 0,
          entities: nlpResult.entities || {},
          department: nlpResult.department,
          course: nlpResult.course
        },
        attempts: 1
      });
      
      console.log(`📝 Stored unanswered question: "${question}"`);
      console.log(`📋 Total unanswered questions: ${this.unansweredQuestions.length}`);
      
      // Notify admin (in a real system, this could send email/notification)
      this.notifyAdminNewQuestion(question);
      
    } else {
      // Update existing question (increment attempts, update timestamp)
      existingQuestion.timestamp = new Date().toISOString();
      existingQuestion.attempts = (existingQuestion.attempts || 1) + 1;
      existingQuestion.context = { ...this.userContext };
      console.log(`🔄 Updated unanswered question: "${question}" (attempts: ${existingQuestion.attempts})`);
    }
  }

  notifyAdminNewQuestion(question) {
    // In a real implementation, this could:
    // - Send email to admin
    // - Send notification to admin panel
    // - Log to admin dashboard
    console.log(`🔔 ADMIN NOTIFICATION: New unanswered question - "${question}"`);
    
    // Example: You could integrate with a notification service here
    // await sendEmailToAdmin('New Unanswered Question', question);
    // await sendWebhookNotification(question);
  }

  cleanupOldUnansweredQuestions() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const initialCount = this.unansweredQuestions.length;
    this.unansweredQuestions = this.unansweredQuestions.filter(q => {
      const questionDate = new Date(q.timestamp);
      return questionDate > sevenDaysAgo;
    });
    
    const removedCount = initialCount - this.unansweredQuestions.length;
    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} old unanswered questions`);
    }
  }

  updateUserContext(question, nlpResult = null) {
    const q = question.toLowerCase();
    
    // Use NLP results if available for better context
    if (nlpResult && nlpResult.department) {
      this.userContext.lastDepartment = nlpResult.department;
      this.userContext.preferences.interestArea = nlpResult.department;
    } else {
      // Fallback to keyword extraction
      this.extractDepartmentContext(q);
    }
    
    if (nlpResult && nlpResult.course) {
      this.userContext.lastCourse = nlpResult.course;
    } else {
      this.extractCourseContext(q);
    }
    
    if (nlpResult && nlpResult.entities && nlpResult.entities.courseLevel) {
      this.userContext.preferences.courseLevel = nlpResult.entities.courseLevel;
    } else {
      this.extractCourseLevelContext(q);
    }
    
    // Extract leadership context
    this.extractLeadershipContext(q);
    
    // Extract contact context
    this.extractContactContext(q);
    
    // Extract query type if not already set
    if (!this.userContext.preferences.queryType) {
      this.extractQueryTypeContext(q);
    }
    
    // Update last intent from NLP if available
    if (nlpResult && nlpResult.intent) {
      this.userContext.lastIntent = nlpResult.intent;
    }
  }

  extractDepartmentContext(q) {
    const departments = [
      'information technology', 'it', 'computer science', 'cs', 
      'biotechnology', 'biotech', 'management', 'bms', 'bba',
      'arts', 'science', 'commerce'
    ];
    
    departments.forEach(dept => {
      if (q.includes(dept)) {
        this.userContext.lastDepartment = this.formatDepartmentName(dept);
        this.userContext.preferences.interestArea = this.formatDepartmentName(dept);
      }
    });
  }

  extractCourseContext(q) {
    const courseKeywords = [
      'b.sc it', 'b.sc computer', 'm.sc it', 'b.com', 'm.com', 
      'bba', 'bms', 'b.sc', 'm.sc', 'b.a', 'm.a', 'phd', 'diploma'
    ];
    
    courseKeywords.forEach(course => {
      if (q.includes(course)) {
        this.userContext.lastCourse = course.toUpperCase();
      }
    });
  }

  extractCourseLevelContext(q) {
    if (q.includes('undergraduate') || q.includes('bachelor') || q.includes('b.') || q.includes('bachelor')) {
      this.userContext.preferences.courseLevel = 'undergraduate';
    } else if (q.includes('postgraduate') || q.includes('master') || q.includes('m.') || q.includes('master')) {
      this.userContext.preferences.courseLevel = 'postgraduate';
    } else if (q.includes('phd') || q.includes('research')) {
      this.userContext.preferences.courseLevel = 'phd';
    } else if (q.includes('diploma')) {
      this.userContext.preferences.courseLevel = 'diploma';
    }
  }

  extractLeadershipContext(q) {
    if (q.includes('principal') || q.includes('director')) {
      this.userContext.preferences.queryType = 'leadership';
    } else if (q.includes('president') || q.includes('chairman')) {
      this.userContext.preferences.queryType = 'leadership';
    } else if (q.includes('vice principal') || q.includes('deputy')) {
      this.userContext.preferences.queryType = 'leadership';
    }
  }

  extractContactContext(q) {
    if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('address')) {
      this.userContext.preferences.queryType = 'contact';
    }
  }

  extractQueryTypeContext(q) {
    if (q.includes('fee') || q.includes('cost') || q.includes('price')) {
      this.userContext.preferences.queryType = 'financial';
    } else if (q.includes('placement') || q.includes('job') || q.includes('career')) {
      this.userContext.preferences.queryType = 'placement';
    } else if (q.includes('admission') || q.includes('apply')) {
      this.userContext.preferences.queryType = 'admission';
    } else if (q.includes('facility') || q.includes('infrastructure')) {
      this.userContext.preferences.queryType = 'facilities';
    } else if (q.includes('course') || q.includes('program')) {
      this.userContext.preferences.queryType = 'academic';
    } else if (q.includes('scholarship') || q.includes('financial aid')) {
      this.userContext.preferences.queryType = 'financial';
    } else if (q.includes('event') || q.includes('activity')) {
      this.userContext.preferences.queryType = 'events';
    }
  }

  formatDepartmentName(keyword) {
    const departmentMap = {
      'it': 'Information Technology',
      'information technology': 'Information Technology',
      'computer science': 'Computer Science',
      'cs': 'Computer Science',
      'biotechnology': 'Biotechnology',
      'biotech': 'Biotechnology',
      'management': 'Management Studies',
      'bms': 'Management Studies',
      'bba': 'Management Studies',
      'arts': 'Arts',
      'science': 'Science',
      'commerce': 'Commerce'
    };
    
    return departmentMap[keyword] || keyword;
  }

  getContextualFallbackResponse() {
    const context = this.userContext;
    
    if (context.lastDepartment) {
      return `I'm not sure I understood your question about ${context.lastDepartment}. \n\nI can help you with:\n• Courses and programs in ${context.lastDepartment}\n• Fee structure and eligibility\n• Placement statistics\n• Department faculty and facilities\n• Research areas and labs\n\nPlease try rephrasing your question or ask about specific information.`;
    }
    
    if (context.lastCourse) {
      return `I apologize, but I'm having trouble processing your question about ${context.lastCourse}. \n\nI can help you with:\n• Detailed course information\n• Fee structure and duration\n• Eligibility criteria\n• Career opportunities\n• Syllabus and subjects\n\nPlease try rephrasing your question.`;
    }
    
    if (context.preferences.queryType === 'leadership') {
      return `I want to make sure I provide the right leadership information. \n\nI can help you with:\n• Principal details and contact information\n• President of governing council\n• Vice principal information\n• Department heads and faculty\n\nPlease try asking specifically like:\n• "Who is the principal?"\n• "Principal contact information"\n• "Tell me about the president"\n• "Vice principal details"`;
    }
    
    if (context.preferences.queryType === 'contact') {
      return `I want to make sure I provide the correct contact details. \n\nI can help you with:\n• College phone numbers and email addresses\n• Complete address and location details\n• Department-specific contacts\n• Office hours and working days\n\nPlease try asking specifically like:\n• "College contact details"\n• "Phone numbers"\n• "Email addresses"\n• "College location"\n• "How to reach the college"`;
    }
    
    if (context.preferences.courseLevel) {
      return `I'm not sure I understood your question about ${context.preferences.courseLevel} programs. \n\nI can help you with:\n• All ${context.preferences.courseLevel} courses\n• Admission requirements\n• Fee structures\n• Placement opportunities\n• Career prospects\n\nPlease try asking your question in a different way.`;
    }
    
    return `I apologize, but I'm having trouble understanding your question. \n\nI can help you with comprehensive information about Ramniranjan Jhunjhunwala College:\n\n👨‍🏫 **Leadership & Contact**\n• Principal, President, Vice Principal details\n• Complete contact information\n• Phone numbers and email addresses\n\n🎓 **Academic Programs**\n• All departments and courses\n• Undergraduate and postgraduate programs\n• Admission process for 2025-26\n\n💰 **Financial Information**\n• Complete fee structures\n• Scholarship opportunities\n• Financial aid options\n\n🏢 **Placements & Facilities**\n• Placement statistics\n• Top recruiting companies\n• College facilities and infrastructure\n\nPlease try asking your question in a different way, or type "help" to see everything I can assist with.`;
  }

  // Admin Management Methods
  getUnansweredQuestions() {
    return this.unansweredQuestions.map(q => ({
      question: q.question,
      timestamp: q.timestamp,
      attempts: q.attempts || 1,
      context: q.context,
      nlpData: q.nlpData
    }));
  }

  removeUnansweredQuestion(question) {
    const index = this.unansweredQuestions.findIndex(
      q => q.question === question
    );
    
    if (index !== -1) {
      const removedQuestion = this.unansweredQuestions.splice(index, 1)[0];
      console.log(`🗑️ Removed unanswered question: "${question}"`);
      return removedQuestion;
    }
    return null;
  }

  addKnowledgeBaseAnswer(question, answer, category = 'general') {
    // Remove from unanswered questions
    const removedQuestion = this.removeUnansweredQuestion(question);
    
    if (removedQuestion) {
      console.log(`📚 Added answer to knowledge base for: "${question}"`);
      // In a real system, you would update your knowledge base here
      // this.responseGenerator.addToKnowledgeBase(question, answer, category);
      
      return {
        success: true,
        message: 'Answer added successfully',
        question: question,
        answer: answer,
        category: category
      };
    }
    
    return {
      success: false,
      message: 'Question not found in unanswered questions'
    };
  }

  clearUnansweredQuestions() {
    const count = this.unansweredQuestions.length;
    this.unansweredQuestions = [];
    console.log(`🧹 Cleared all ${count} unanswered questions`);
    return count;
  }

  updateAdminSettings(newSettings) {
    this.adminSettings = { ...this.adminSettings, ...newSettings };
    console.log('⚙️ Updated admin settings:', this.adminSettings);
    return this.adminSettings;
  }

  // Enhanced Analytics Methods
  getConversationHistory() {
    return this.conversationHistory.map(entry => ({
      question: entry.question,
      response: entry.response,
      timestamp: entry.timestamp,
      department: entry.context.lastDepartment,
      course: entry.context.lastCourse,
      intent: entry.intent,
      nlpIntent: entry.nlpData?.intent,
      confidence: entry.nlpData?.confidence,
      isFallback: entry.isFallback,
      responseLength: entry.responseLength
    }));
  }

  getContextSummary() {
    return {
      lastDepartment: this.userContext.lastDepartment,
      lastCourse: this.userContext.lastCourse,
      lastIntent: this.userContext.lastIntent,
      preferences: this.userContext.preferences,
      conversationCount: this.conversationHistory.length,
      unansweredCount: this.unansweredQuestions.length,
      lastInteraction: this.conversationHistory.length > 0 ? 
        this.conversationHistory[this.conversationHistory.length - 1].timestamp : null,
      adminSettings: this.adminSettings
    };
  }

  clearHistory() {
    const conversationCount = this.conversationHistory.length;
    this.conversationHistory = [];
    this.userContext = {
      lastDepartment: null,
      lastCourse: null,
      lastIntent: null,
      preferences: {
        courseLevel: null,
        interestArea: null,
        queryType: null
      }
    };
    console.log(`🗑️ Conversation history cleared (${conversationCount} conversations)`);
    return conversationCount;
  }

  getSuggestedQuestions() {
    const context = this.userContext;
    const suggestions = [];
    
    if (context.lastDepartment) {
      suggestions.push(
        `Courses in ${context.lastDepartment}`,
        `Fee structure for ${context.lastDepartment}`,
        `Placements in ${context.lastDepartment}`,
        `Facilities in ${context.lastDepartment}`,
        `Contact ${context.lastDepartment} department`
      );
    }
    
    if (context.lastCourse) {
      suggestions.push(
        `Detailed information about ${context.lastCourse}`,
        `Eligibility for ${context.lastCourse}`,
        `${context.lastCourse} fee structure`,
        `Placement opportunities for ${context.lastCourse}`
      );
    }
    
    if (context.preferences.queryType === 'leadership') {
      suggestions.push(
        "Who is the principal?",
        "Principal contact information",
        "Tell me about the president",
        "Vice principal details",
        "Department heads information"
      );
    }
    
    if (context.preferences.queryType === 'contact') {
      suggestions.push(
        "College contact details",
        "Phone numbers and email",
        "College address and location",
        "How to reach the college",
        "Office hours"
      );
    }

    if (context.preferences.courseLevel) {
      suggestions.push(
        `All ${context.preferences.courseLevel} programs`,
        `Admission process for ${context.preferences.courseLevel} courses`,
        `Scholarships for ${context.preferences.courseLevel} students`
      );
    }

    // Add general suggestions
    if (suggestions.length === 0) {
      suggestions.push(
        "Who is the principal?",
        "College contact details",
        "List all departments",
        "What courses are available?",
        "Admission process for 2025-26",
        "Placement statistics",
        "College facilities",
        "Scholarship information"
      );
    }

    return suggestions.slice(0, 6);
  }

  analyzeConversationPatterns() {
    if (this.conversationHistory.length === 0) {
      return {
        totalQuestions: 0,
        message: "No conversation history available for analysis."
      };
    }

    const intents = {};
    const departments = {};
    const courses = {};
    const queryTypes = {};
    const fallbackRate = { total: 0, fallbacks: 0 };
    let totalQuestions = 0;

    this.conversationHistory.forEach(entry => {
      if (entry.intent) {
        intents[entry.intent] = (intents[entry.intent] || 0) + 1;
      }
      if (entry.nlpData?.intent) {
        intents[entry.nlpData.intent] = (intents[entry.nlpData.intent] || 0) + 1;
      }
      if (entry.context.lastDepartment) {
        departments[entry.context.lastDepartment] = (departments[entry.context.lastDepartment] || 0) + 1;
      }
      if (entry.context.lastCourse) {
        courses[entry.context.lastCourse] = (courses[entry.context.lastCourse] || 0) + 1;
      }
      if (entry.context.preferences.queryType) {
        queryTypes[entry.context.preferences.queryType] = (queryTypes[entry.context.preferences.queryType] || 0) + 1;
      }
      if (entry.isFallback) {
        fallbackRate.fallbacks++;
      }
      fallbackRate.total++;
      totalQuestions++;
    });

    return {
      totalQuestions,
      fallbackRate: totalQuestions > 0 ? (fallbackRate.fallbacks / totalQuestions * 100).toFixed(2) + '%' : '0%',
      popularIntents: Object.entries(intents)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      popularDepartments: Object.entries(departments)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      popularCourses: Object.entries(courses)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      popularQueryTypes: Object.entries(queryTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      userInterests: this.userContext.preferences,
      unansweredQuestions: this.unansweredQuestions.length
    };
  }

  // Performance and Health Methods
  getSystemHealth() {
    return {
      status: 'healthy',
      conversations: this.conversationHistory.length,
      unansweredQuestions: this.unansweredQuestions.length,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      lastActivity: this.conversationHistory.length > 0 ? 
        this.conversationHistory[this.conversationHistory.length - 1].timestamp : 'No activity yet'
    };
  }

  exportData() {
    return {
      conversationHistory: this.getConversationHistory(),
      unansweredQuestions: this.getUnansweredQuestions(),
      contextSummary: this.getContextSummary(),
      analytics: this.analyzeConversationPatterns(),
      systemHealth: this.getSystemHealth(),
      exportTimestamp: new Date().toISOString()
    };
  }
}

module.exports = ChatbotEngine;