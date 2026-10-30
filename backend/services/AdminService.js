// backend/services/AdminService.js
const { UnansweredQuestion, KnowledgeBase, AdminUser } = require('../models/AdminModel');

class AdminService {
  constructor() {
    this.knowledgeBase = new Map();
    this.loadKnowledgeBase();
  }

  async loadKnowledgeBase() {
    try {
      const kbEntries = await KnowledgeBase.find({ isActive: true });
      kbEntries.forEach(entry => {
        this.knowledgeBase.set(entry.question.toLowerCase(), entry);
        // Also add variations
        entry.questionVariations.forEach(variation => {
          this.knowledgeBase.set(variation.toLowerCase(), entry);
        });
      });
      console.log(`📚 Loaded ${kbEntries.length} knowledge base entries`);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  }

  async logUnansweredQuestion(questionData) {
    try {
      const unansweredQuestion = new UnansweredQuestion({
        question: questionData.processedQuestion,
        originalQuestion: questionData.originalQuestion,
        intent: questionData.intent,
        confidence: questionData.confidence,
        context: questionData.context,
        userIP: questionData.userIP,
        category: this.categorizeQuestion(questionData.processedQuestion),
        priority: this.determinePriority(questionData)
      });

      await unansweredQuestion.save();
      
      // Notify admins (you can integrate with email/notification service here)
      this.notifyAdmins(unansweredQuestion);
      
      return unansweredQuestion;
    } catch (error) {
      console.error('Error logging unanswered question:', error);
      throw error;
    }
  }

  categorizeQuestion(question) {
    const q = question.toLowerCase();
    if (q.includes('fee') || q.includes('cost') || q.includes('price')) return 'fees';
    if (q.includes('admission') || q.includes('apply')) return 'admissions';
    if (q.includes('course') || q.includes('program')) return 'courses';
    if (q.includes('placement') || q.includes('job')) return 'placements';
    if (q.includes('contact') || q.includes('phone') || q.includes('email')) return 'contact';
    if (q.includes('principal') || q.includes('faculty')) return 'leadership';
    if (q.includes('facility') || q.includes('hostel')) return 'facilities';
    return 'general';
  }

  determinePriority(questionData) {
    if (questionData.confidence < 0.3) return 'high';
    if (questionData.intent === 'unknown') return 'high';
    if (questionData.context?.preferences?.queryType === 'contact') return 'high';
    return 'medium';
  }

  async notifyAdmins(question) {
    try {
      const admins = await AdminUser.find({ 
        isActive: true,
        'permissions.canManageKB': true 
      });
      
      // Here you can implement email notifications, push notifications, etc.
      console.log(`🔔 New unanswered question (ID: ${question._id}) - Notifying ${admins.length} admins`);
      
      // For now, we'll just log it. You can integrate with:
      // - Email service (Nodemailer)
      // - Slack webhook
      // - Push notifications
      // - Database flag for admin panel
    } catch (error) {
      console.error('Error notifying admins:', error);
    }
  }

  async checkKnowledgeBase(question) {
    const q = question.toLowerCase().trim();
    
    // Exact match
    if (this.knowledgeBase.has(q)) {
      const entry = this.knowledgeBase.get(q);
      await this.incrementUsageCount(entry._id);
      return entry;
    }
    
    // Partial match
    for (const [key, entry] of this.knowledgeBase) {
      if (q.includes(key) || key.includes(q)) {
        await this.incrementUsageCount(entry._id);
        return entry;
      }
    }
    
    return null;
  }

  async incrementUsageCount(entryId) {
    try {
      await KnowledgeBase.findByIdAndUpdate(entryId, {
        $inc: { usageCount: 1 },
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error incrementing usage count:', error);
    }
  }

  async addToKnowledgeBase(kbData) {
    try {
      const knowledgeEntry = new KnowledgeBase(kbData);
      await knowledgeEntry.save();
      
      // Update in-memory knowledge base
      this.knowledgeBase.set(kbData.question.toLowerCase(), knowledgeEntry);
      kbData.questionVariations.forEach(variation => {
        this.knowledgeBase.set(variation.toLowerCase(), knowledgeEntry);
      });
      
      // Update corresponding unanswered question status
      if (kbData.sourceQuestionId) {
        await UnansweredQuestion.findByIdAndUpdate(kbData.sourceQuestionId, {
          status: 'added',
          adminResponse: kbData.answer
        });
      }
      
      return knowledgeEntry;
    } catch (error) {
      console.error('Error adding to knowledge base:', error);
      throw error;
    }
  }

  async getUnansweredQuestions(filter = {}) {
    try {
      return await UnansweredQuestion.find(filter)
        .sort({ timestamp: -1, priority: -1 });
    } catch (error) {
      console.error('Error fetching unanswered questions:', error);
      throw error;
    }
  }

  async getKnowledgeBaseStats() {
    try {
      const totalEntries = await KnowledgeBase.countDocuments();
      const activeEntries = await KnowledgeBase.countDocuments({ isActive: true });
      const totalUnanswered = await UnansweredQuestion.countDocuments();
      const pendingUnanswered = await UnansweredQuestion.countDocuments({ status: 'pending' });
      
      return {
        totalEntries,
        activeEntries,
        totalUnanswered,
        pendingUnanswered
      };
    } catch (error) {
      console.error('Error getting KB stats:', error);
      throw error;
    }
  }

  async updateUnansweredQuestionStatus(questionId, status, adminResponse = '', assignedTo = '') {
    try {
      return await UnansweredQuestion.findByIdAndUpdate(questionId, {
        status,
        adminResponse,
        assignedTo,
        updatedAt: new Date()
      }, { new: true });
    } catch (error) {
      console.error('Error updating question status:', error);
      throw error;
    }
  }
}

module.exports = AdminService;