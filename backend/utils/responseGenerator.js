// backend/utils/responseGenerator.js
const collegeData = require('../data/college_data.js');
const NLPProcessor = require('./nlpProcessor.js');
const fs = require('fs');
const path = require('path');

class ResponseGenerator {
  constructor() {
    this.nlpProcessor = new NLPProcessor();
    this.lastIntent = null;
    
    // Dynamic knowledge base with file persistence
    this.knowledgeBaseFile = path.join(__dirname, '../data/dynamic_knowledge_base.json');
    this.dynamicKnowledgeBase = this.loadKnowledgeBase();
    
    // Track usage statistics
    this.usageStats = {
      totalQueries: 0,
      dynamicAnswersUsed: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  // Load knowledge base from file
  loadKnowledgeBase() {
    try {
      if (fs.existsSync(this.knowledgeBaseFile)) {
        const data = fs.readFileSync(this.knowledgeBaseFile, 'utf8');
        const parsed = JSON.parse(data);
        console.log(`📚 Loaded ${parsed.dynamicKnowledgeBase.length} dynamic answers from file`);
        return parsed.dynamicKnowledgeBase || [];
      }
    } catch (error) {
      console.error('❌ Error loading knowledge base:', error);
    }
    return [];
  }

  // Save knowledge base to file
  saveKnowledgeBase() {
    try {
      const data = {
        dynamicKnowledgeBase: this.dynamicKnowledgeBase,
        usageStats: this.usageStats,
        lastSaved: new Date().toISOString()
      };
      fs.writeFileSync(this.knowledgeBaseFile, JSON.stringify(data, null, 2));
      console.log(`💾 Saved ${this.dynamicKnowledgeBase.length} dynamic answers to file`);
    } catch (error) {
      console.error('❌ Error saving knowledge base:', error);
    }
  }

  // Add this method to handle dynamic knowledge base
  addToKnowledgeBase(question, answer, category = 'general') {
    // Remove any existing entry for this question (case insensitive)
    this.dynamicKnowledgeBase = this.dynamicKnowledgeBase.filter(
      item => item.question.toLowerCase() !== question.toLowerCase()
    );
    
    // Add new entry
    this.dynamicKnowledgeBase.push({
      question: question,
      answer: answer,
      category: category,
      timestamp: new Date().toISOString(),
      usageCount: 0,
      lastUsed: null
    });
    
    // Save to file
    this.saveKnowledgeBase();
    
    console.log(`📚 Added to knowledge base: "${question}"`);
    console.log(`📋 Total dynamic answers: ${this.dynamicKnowledgeBase.length}`);
    
    return {
      success: true,
      message: 'Answer added to knowledge base successfully',
      question: question,
      category: category,
      timestamp: new Date().toISOString()
    };
  }

  // Check if question exists in dynamic knowledge base
  findInDynamicKnowledgeBase(question) {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Exact match first
    let match = this.dynamicKnowledgeBase.find(
      item => item.question.toLowerCase() === normalizedQuestion
    );
    
    // If no exact match, try partial match
    if (!match) {
      match = this.dynamicKnowledgeBase.find(item => 
        normalizedQuestion.includes(item.question.toLowerCase()) ||
        item.question.toLowerCase().includes(normalizedQuestion)
      );
    }
    
    // If still no match, try keyword matching
    if (!match) {
      const questionWords = normalizedQuestion.split(' ');
      match = this.dynamicKnowledgeBase.find(item => {
        const itemWords = item.question.toLowerCase().split(' ');
        return questionWords.some(word => 
          word.length > 3 && itemWords.includes(word)
        );
      });
    }
    
    if (match) {
      // Update usage statistics
      match.usageCount++;
      match.lastUsed = new Date().toISOString();
      this.usageStats.dynamicAnswersUsed++;
      this.usageStats.totalQueries++;
      
      // Save updated usage stats
      this.saveKnowledgeBase();
      
      console.log(`🎯 Using dynamic answer for: "${question}"`);
      console.log(`📊 Usage count: ${match.usageCount}`);
      
      return {
        answer: match.answer,
        source: 'dynamic',
        usageCount: match.usageCount,
        category: match.category
      };
    }
    
    this.usageStats.totalQueries++;
    return null;
  }

  // Get dynamic knowledge base statistics
  getDynamicKnowledgeStats() {
    return {
      totalAnswers: this.dynamicKnowledgeBase.length,
      totalUsage: this.dynamicKnowledgeBase.reduce((sum, item) => sum + item.usageCount, 0),
      mostUsed: [...this.dynamicKnowledgeBase].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5),
      byCategory: this.dynamicKnowledgeBase.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {}),
      usageStats: this.usageStats,
      lastSaved: this.dynamicKnowledgeBase.length > 0 ? 
        this.dynamicKnowledgeBase[0].timestamp : 'Never'
    };
  }

  // Remove from dynamic knowledge base
  removeFromKnowledgeBase(question) {
    const initialLength = this.dynamicKnowledgeBase.length;
    this.dynamicKnowledgeBase = this.dynamicKnowledgeBase.filter(
      item => item.question.toLowerCase() !== question.toLowerCase()
    );
    
    const removed = initialLength - this.dynamicKnowledgeBase.length;
    if (removed > 0) {
      // Save to file after removal
      this.saveKnowledgeBase();
      console.log(`🗑️ Removed from knowledge base: "${question}"`);
      return {
        success: true,
        message: `Removed ${removed} answer(s) from knowledge base`,
        removedCount: removed
      };
    }
    
    return {
      success: false,
      message: 'Question not found in knowledge base'
    };
  }

  // Export knowledge base data (for backup)
  exportKnowledgeBase() {
    return {
      dynamicKnowledgeBase: this.dynamicKnowledgeBase,
      usageStats: this.usageStats,
      exportTimestamp: new Date().toISOString(),
      totalAnswers: this.dynamicKnowledgeBase.length
    };
  }

  // Import knowledge base data (for restore)
  importKnowledgeBase(data) {
    if (data && data.dynamicKnowledgeBase) {
      this.dynamicKnowledgeBase = data.dynamicKnowledgeBase;
      this.usageStats = data.usageStats || this.usageStats;
      this.saveKnowledgeBase();
      console.log(`🔄 Imported ${this.dynamicKnowledgeBase.length} answers`);
      return {
        success: true,
        message: `Imported ${this.dynamicKnowledgeBase.length} answers successfully`
      };
    }
    return {
      success: false,
      message: 'Invalid import data'
    };
  }

  generateResponse(question) {
    try {
      // First, check dynamic knowledge base
      const dynamicAnswer = this.findInDynamicKnowledgeBase(question);
      if (dynamicAnswer) {
        console.log(`🎯 Using dynamic knowledge base answer`);
        this.lastIntent = 'DYNAMIC_ANSWER';
        return dynamicAnswer.answer;
      }

      const analysis = this.nlpProcessor.processQuestion(question);
      console.log('🔍 NLP Analysis:', analysis);
      
      // Store last intent for context
      this.lastIntent = analysis.intent;
      
      return this.generateResponseFromAnalysis(analysis);
    } catch (error) {
      console.error('Error generating response:', error);
      return this.getFallbackResponse();
    }
  }
// Add farewell detection method
generateResponse(question) {
  try {
    // First, check dynamic knowledge base
    const dynamicAnswer = this.findInDynamicKnowledgeBase(question);
    if (dynamicAnswer) {
      console.log(`🎯 Using dynamic knowledge base answer`);
      this.lastIntent = 'DYNAMIC_ANSWER';
      return dynamicAnswer.answer;
    }

   // === ADD THIS: Check for farewell/goodbye messages ===
const farewellResponse = this.checkFarewell(question);
if (farewellResponse) {
  return farewellResponse;
}
// === END ADDITION ===

    const analysis = this.nlpProcessor.processQuestion(question);
    console.log('🔍 NLP Analysis:', analysis);
    
    // Store last intent for context
    this.lastIntent = analysis.intent;
    
    return this.generateResponseFromAnalysis(analysis);
  } catch (error) {
    console.error('Error generating response:', error);
    return this.getFallbackResponse();
  }
}

// Add farewell detection method
checkFarewell(question) {
  const lowerQuestion = question.toLowerCase().trim();
  
  const farewellKeywords = [
    'bye', 'goodbye', 'see you', 'farewell', 'take care', 
    'cya', 'later', 'good night', 'have a good day',
    'thank you bye', 'thanks bye', 'that\'s all', 'that will be all'
  ];
  
  const isFarewell = farewellKeywords.some(keyword => 
    lowerQuestion.includes(keyword)
  );
  
  if (isFarewell) {
    const farewellResponses = [
      "Goodbye! Have a great day! 🎓",
      "Thank you for visiting RJ College! Come back soon! 👋",
      "Farewell! If you have more questions, I'm always here to help! 📚",
      "Goodbye! Best of luck with your academic journey! 🌟",
      "See you later! Don't hesitate to reach out if you need more information about RJ College! 💙",
      "Take care! Hope to assist you again soon! 🎒",
      "Goodbye! Remember to check our website for latest updates! 🌐",
      "Farewell! Wishing you success in all your endeavors! ✨",
      "Thank you for chatting with RJ College Assistant! Visit us again! 🏫",
      "Goodbye! If you're considering admission, don't hesitate to ask about our courses and admission process! 📝"
    ];
    
    this.lastIntent = 'FAREWELL';
    console.log(`👋 Farewell detected: "${question}"`);
    
    return farewellResponses[Math.floor(Math.random() * farewellResponses.length)];
  }
  
  return null;
}
  // Rest of your existing methods remain EXACTLY THE SAME - no changes needed
  generateResponseFromAnalysis(analysis) {
    const { intent, department, course, entities, confidence, originalQuestion } = analysis;
    
    // Handle greetings first
    if (intent === this.nlpProcessor.intents.GREETING) {
      return this.generateGreetingResponse();
    }
    
    // Handle thanks
    if (intent === this.nlpProcessor.intents.THANKS) {
      return this.generateThanksResponse();
    }
    
    // Handle help
    if (intent === this.nlpProcessor.intents.HELP) {
      return this.generateHelpResponse();
    }
    
    // Handle course queries with high priority
    if (this.isCourseQuery(originalQuestion) || intent === this.nlpProcessor.intents.COURSE_LIST) {
      return this.generateCoursesResponse(department, entities.courseLevel);
    }
    
    if (confidence < 0.5) {
      return this.getClarificationResponse(analysis);
    }

    switch (intent) {
      case this.nlpProcessor.intents.DEPARTMENT_LIST:
        return this.generateDepartmentsResponse();
      
      case this.nlpProcessor.intents.DEPARTMENT_DETAILS:
        return this.generateDepartmentDetailsResponse(department);
      
      case this.nlpProcessor.intents.DEPARTMENT_COURSES:
        return this.generateDepartmentCoursesResponse(department);
      
      case this.nlpProcessor.intents.DEPARTMENT_HEAD:
        return this.generateDepartmentHeadResponse(department);
      
      case this.nlpProcessor.intents.DEPARTMENT_FACILITIES:
        return this.generateDepartmentFacilitiesResponse(department);
      
      case this.nlpProcessor.intents.COURSE_LIST:
        return this.generateCoursesResponse(department, entities.courseLevel);
      
      case this.nlpProcessor.intents.COURSE_DETAILS:
        return this.generateCourseDetailsResponse(course || department);
      
      case this.nlpProcessor.intents.COURSE_FEES:
        return this.generateCourseFeesResponse(course || department);
      
      case this.nlpProcessor.intents.COURSE_ELIGIBILITY:
        return this.generateCourseEligibilityResponse(course || department);
      
      case this.nlpProcessor.intents.COURSE_SYLLABUS:
        return this.generateCourseSyllabusResponse(course || department);
      
      case this.nlpProcessor.intents.COURSE_CAREER:
        return this.generateCourseCareerResponse(course || department);
      
      case this.nlpProcessor.intents.ADMISSION_PROCESS:
        return this.generateAdmissionsInfo();
      
      case this.nlpProcessor.intents.ADMISSION_DATES:
        return this.generateAdmissionDates();
      
      case this.nlpProcessor.intents.ADMISSION_ELIGIBILITY:
        return this.generateAdmissionEligibility();
      
      case this.nlpProcessor.intents.ADMISSION_CONTACT:
        return this.generateAdmissionContact();
      
      case this.nlpProcessor.intents.ADMISSION_DOCUMENTS:
        return this.generateAdmissionDocuments();
      
      case this.nlpProcessor.intents.PLACEMENT_STATS:
        return this.generatePlacementStatsResponse(department);
      
      case this.nlpProcessor.intents.PLACEMENT_COMPANIES:
        return this.generatePlacementCompaniesResponse(department);
      
      case this.nlpProcessor.intents.PLACEMENT_PROCESS:
        return this.generatePlacementProcess();
      
      case this.nlpProcessor.intents.PLACEMENT_CONTACT:
        return this.generatePlacementContact();
      
      case this.nlpProcessor.intents.PLACEMENT_TRAINING:
        return this.generatePlacementTraining();
      
      case this.nlpProcessor.intents.PRINCIPAL_INFO:
        return this.generatePrincipalInfo();
      
      case this.nlpProcessor.intents.PRESIDENT_INFO:
        return this.generatePresidentInfo();
      
      case this.nlpProcessor.intents.VICE_PRINCIPAL_INFO:
        return this.generateVicePrincipalInfo();
      
      case this.nlpProcessor.intents.DEPARTMENT_HEAD_INFO:
        return this.generateDepartmentHeadInfo(department);
      
      case this.nlpProcessor.intents.CONTACT_INFO:
        return this.generateContactInfo();
      
      case this.nlpProcessor.intents.LOCATION_INFO:
        return this.generateLocationInfo();
      
      case this.nlpProcessor.intents.PHONE_INFO:
        return this.generatePhoneInfo();
      
      case this.nlpProcessor.intents.EMAIL_INFO:
        return this.generateEmailInfo();
      
      case this.nlpProcessor.intents.FEE_STRUCTURE:
        return this.generateFeeStructureResponse(department, course);
      
      case this.nlpProcessor.intents.SCHOLARSHIPS:
        return this.generateScholarshipsInfo();
      
      case this.nlpProcessor.intents.FINANCIAL_AID:
        return this.generateFinancialAidInfo();
      
      case this.nlpProcessor.intents.FACILITIES:
        return this.generateFacilitiesInfo();
      
      case this.nlpProcessor.intents.INFRASTRUCTURE:
        return this.generateInfrastructureInfo();
      
      case this.nlpProcessor.intents.LIBRARY_INFO:
        return this.generateLibraryInfo();
      
      case this.nlpProcessor.intents.HOSTEL_INFO:
        return this.generateHostelInfo();
      
      case this.nlpProcessor.intents.SPORTS_INFO:
        return this.generateSportsInfo();
      
      case this.nlpProcessor.intents.ACHIEVEMENTS:
        return this.generateAchievementsInfo();
      
      case this.nlpProcessor.intents.ABOUT_COLLEGE:
        return this.generateAboutCollege();
      
      case this.nlpProcessor.intents.EVENTS:
        return this.generateEventsInfo();
      
      case this.nlpProcessor.intents.STUDENT_SUPPORT:
        return this.generateStudentSupportInfo();

      case this.nlpProcessor.intents.NEP_OVERVIEW:
        return this.generateNEPOverview();

      case this.nlpProcessor.intents.NEP_FEATURES:
        return this.generateNEPFeatures();

      case this.nlpProcessor.intents.NEP_CREDIT_SYSTEM:
        return this.generateNEPCreditSystem();

      case this.nlpProcessor.intents.NEP_MULTIDISCIPLINARY:
        return this.generateNEPMultidisciplinary();

      case this.nlpProcessor.intents.NEP_ENTRY_EXIT:
        return this.generateNEPEntryExit();

      case this.nlpProcessor.intents.NEP_IMPLEMENTATION:
        return this.generateNEPImplementation();

      case this.nlpProcessor.intents.NEP_BENEFITS:
        return this.generateNEPBenefits();
      
      default:
        return this.generateGeneralResponse(analysis);
    }
  }

  // ALL YOUR EXISTING METHODS CONTINUE EXACTLY AS THEY WERE...
  // I'm showing the structure to prove nothing is deleted

  isCourseQuery(question) {
    const q = question.toLowerCase();
    const courseKeywords = [
      'course', 'courses', 'program', 'programs', 'degree', 'degrees',
      'study', 'studies', 'what can i study', 'study options',
      'academic programs', 'all programs', 'available courses',
      'list courses', 'show courses', 'which courses'
    ];
    
    return courseKeywords.some(keyword => q.includes(keyword)) || 
           /^(courses?|programs?|degrees?)$/i.test(q) ||
           /(what|which|list|show).*(courses?|programs?)/i.test(q);
  }

  // ========== LEADERSHIP & CONTACT METHODS ==========

  generatePrincipalInfo() {
    const principal = collegeData.principal;
    
    let response = `**Principal of RJ College** 👨‍🏫\n\n`;
    response += `**Name:** ${principal.name}\n`;
    response += `**Title:** ${principal.title}\n`;
    response += `**Qualification:** ${principal.qualification}\n`;
    response += `**Experience:** ${principal.experience}\n`;
    response += `**Specialization:** ${principal.specialization}\n\n`;
    
    response += `**Previous Positions:**\n`;
    principal.previous_positions.forEach(position => {
      response += `• ${position}\n`;
    });
    
    response += `\n**Awards & Recognition:**\n`;
    principal.awards.forEach(award => {
      response += `• ${award}\n`;
    });
    
    response += `\n**Message from Principal:**\n"${principal.message}"\n\n`;
    
    response += `**Contact Information:**\n`;
    response += `📧 Email: ${principal.email}\n`;
    response += `📞 Phone: ${principal.phone}\n`;
    response += `🕒 Office Hours: ${principal.office_hours}\n`;
    
    return response;
  }

  generatePresidentInfo() {
    const president = collegeData.president;
    
    let response = `**President, Governing Council** 🎖️\n\n`;
    response += `**Name:** ${president.name}\n`;
    response += `**Title:** ${president.title}\n`;
    response += `**Qualification:** ${president.qualification}\n`;
    response += `**Experience:** ${president.experience}\n\n`;
    
    response += `**Message:**\n"${president.message}"\n\n`;
    
    response += `**Contact:**\n`;
    response += `📧 Email: ${president.email}\n`;
    
    return response;
  }

  generateVicePrincipalInfo() {
    const vp = collegeData.vice_principal;
    
    let response = `**Vice Principal of RJ College** 👩‍🏫\n\n`;
    response += `**Name:** ${vp.name}\n`;
    response += `**Title:** ${vp.title}\n`;
    response += `**Qualification:** ${vp.qualification}\n`;
    response += `**Experience:** ${vp.experience}\n`;
    response += `**Specialization:** ${vp.specialization}\n\n`;
    
    response += `**Contact Information:**\n`;
    response += `📧 Email: ${vp.email}\n`;
    response += `📞 Phone: ${vp.phone}\n`;
    
    return response;
  }

  generateContactInfo() {
    const contact = collegeData.contact;
    
    let response = `**RJ College - Contact Information** 📞\n\n`;
    
    response += `**📍 Address:**\n${contact.address}\n\n`;
    
    response += `**📞 Phone Numbers:**\n`;
    response += `• Main: ${contact.phone.main}\n`;
    response += `• Admissions: ${contact.phone.admission}\n`;
    response += `• Administration: ${contact.phone.administration}\n`;
    response += `• Principal: ${contact.phone.principal}\n`;
    response += `• Placement: ${contact.phone.placement}\n`;
    response += `• Accounts: ${contact.phone.accounts}\n`;
    response += `• Library: ${contact.phone.library}\n\n`;
    
    response += `**📧 Email Addresses:**\n`;
    response += `• General: ${contact.email.general}\n`;
    response += `• Admissions: ${contact.email.admission}\n`;
    response += `• Principal: ${contact.email.principal}\n`;
    response += `• Placement: ${contact.email.placement}\n`;
    response += `• Accounts: ${contact.email.accounts}\n`;
    response += `• Library: ${contact.email.library}\n\n`;
    
    response += `**🌐 Website & Social Media:**\n`;
    response += `• Website: ${contact.website}\n`;
    response += `• Facebook: ${contact.social_media.facebook}\n`;
    response += `• Twitter: ${contact.social_media.twitter}\n`;
    response += `• LinkedIn: ${contact.social_media.linkedin}\n`;
    response += `• Instagram: ${contact.social_media.instagram}\n`;
    response += `• YouTube: ${contact.social_media.youtube}\n\n`;
    
    response += `**🕒 Working Hours:**\n`;
    response += `• College: ${contact.working_hours.college}\n`;
    response += `• Office: ${contact.working_hours.office}\n`;
    response += `• Library: ${contact.working_hours.library}\n\n`;
    
    response += `**📍 Location Details:**\n`;
    response += `• Landmark: ${contact.location.landmark}\n`;
    response += `• Coordinates: ${contact.location.coordinates.latitude}, ${contact.location.coordinates.longitude}\n`;
    response += `• Transportation: ${contact.location.transportation.railway}, ${contact.location.transportation.metro}\n`;
    
    return response;
  }

  generateLocationInfo() {
    const contact = collegeData.contact;
    
    let response = `**RJ College - Location & Address** 📍\n\n`;
    response += `**Full Address:**\n${contact.address}\n\n`;
    
    response += `**Location Details:**\n`;
    response += `• Landmark: ${contact.location.landmark}\n`;
    response += `• Coordinates: ${contact.location.coordinates.latitude}, ${contact.location.coordinates.longitude}\n\n`;
    
    response += `**Transportation:**\n`;
    response += `🚆 Railway: ${contact.location.transportation.railway}\n`;
    response += `🚇 Metro: ${contact.location.transportation.metro}\n`;
    response += `🚌 Bus: ${contact.location.transportation.bus}\n`;
    response += `🅿️ Parking: ${contact.location.transportation.parking}\n\n`;
    
    response += `**How to Reach:**\n`;
    response += `The college is easily accessible from Ghatkopar Railway Station and Metro Station. It's just a 5-minute walk from both stations, located opposite Metro Mall.\n\n`;
    
    response += `**For navigation, use coordinates:**\n`;
    response += `Latitude: ${contact.location.coordinates.latitude}\n`;
    response += `Longitude: ${contact.location.coordinates.longitude}`;
    
    return response;
  }

  generatePhoneInfo() {
    const contact = collegeData.contact;
    
    let response = `**RJ College - Phone Numbers** 📞\n\n`;
    response += `**Main Contact Numbers:**\n`;
    response += `• Main College: ${contact.phone.main}\n`;
    response += `• Admissions Cell: ${contact.phone.admission}\n`;
    response += `• Administration: ${contact.phone.administration}\n`;
    response += `• Principal's Office: ${contact.phone.principal}\n`;
    response += `• Placement Cell: ${contact.phone.placement}\n`;
    response += `• Accounts Section: ${contact.phone.accounts}\n`;
    response += `• Library: ${contact.phone.library}\n\n`;
    
    response += `**Admission Helpline:** ${collegeData.admissions.contact.helpline}\n\n`;
    
    response += `**Office Hours:**\n`;
    response += `• College: ${contact.working_hours.college}\n`;
    response += `• Office: ${contact.working_hours.office}\n\n`;
    
    response += `💡 *For specific department contacts, ask about that department directly.*`;
    
    return response;
  }

  generateEmailInfo() {
    const contact = collegeData.contact;
    
    let response = `**RJ College - Email Addresses** 📧\n\n`;
    response += `**General Inquiries:**\n`;
    response += `• General: ${contact.email.general}\n`;
    response += `• Website: ${contact.website}\n\n`;
    
    response += `**Academic & Administration:**\n`;
    response += `• Principal: ${contact.email.principal}\n`;
    response += `• Admissions: ${contact.email.admission}\n`;
    response += `• Placement: ${contact.email.placement}\n`;
    response += `• Accounts: ${contact.email.accounts}\n`;
    response += `• Library: ${contact.email.library}\n\n`;
    
    response += `**Department Emails:**\n`;
    collegeData.departments.forEach(dept => {
      response += `• ${dept.name}: ${dept.head.email}\n`;
    });
    
    response += `\n**Response Time:**\n`;
    response += `• General emails: Within 24-48 hours\n`;
    response += `• Urgent matters: Please call the respective department\n`;
    
    return response;
  }

  // ========== ACADEMIC METHODS ==========

  generateCoursesResponse(departmentFilter = null, courseLevel = null) {
    let response = `**Academic Programs at RJ College** 🎓\n\n`;

    // If specific department is mentioned
    if (departmentFilter) {
      const department = collegeData.departments.find(
        dept => dept.name.toLowerCase().includes(departmentFilter.toLowerCase())
      );
      
      if (department) {
        response += `**Programs in ${department.name} Department:**\n\n`;
        department.courses.forEach(course => {
          response += `**${course.name}**\n`;
          response += `   📅 Duration: ${course.duration}\n`;
          response += `   🪑 Seats: ${course.seats}\n`;
          response += `   ✅ Eligibility: ${course.eligibility}\n`;
          response += `   💰 Fees: ${course.fees.total} per year\n\n`;
        });
        
        response += `💡 *For detailed syllabus and admission information, contact ${department.name} department at ${department.head.email}*`;
        return response;
      }
    }

    // Filter by course level if specified
    if (courseLevel === 'undergraduate') {
      response += `**Undergraduate Programs (Bachelor's Degrees)**\n\n`;
    } else if (courseLevel === 'postgraduate') {
      response += `**Postgraduate Programs (Master's Degrees)**\n\n`;
    } else if (courseLevel === 'phd') {
      response += `**PhD Research Programs**\n\n`;
    } else if (courseLevel === 'diploma') {
      response += `**Postgraduate Diploma Programs**\n\n`;
    } else {
      response += `The college offers a wide range of undergraduate and postgraduate programs:\n\n`;
    }

    // Undergraduate Programs
    if (!courseLevel || courseLevel === 'undergraduate') {
      if (!courseLevel) response += `**🎓 Undergraduate Programs:**\n`;
      
      collegeData.departments.forEach(dept => {
        const ugCourses = dept.courses.filter(course => 
          course.name.includes('B.') || course.name.includes('Bachelor')
        );
        if (ugCourses.length > 0) {
          response += `\n**${dept.name}:**\n`;
          ugCourses.forEach(course => {
            response += `• ${course.name} (${course.duration}, ${course.seats} seats)\n`;
          });
        }
      });
    }

    // Postgraduate Programs
    if (!courseLevel || courseLevel === 'postgraduate') {
      if (!courseLevel) response += `\n**🎓 Postgraduate Programs:**\n`;
      
      collegeData.departments.forEach(dept => {
        const pgCourses = dept.courses.filter(course => 
          course.name.includes('M.') || course.name.includes('Master')
        );
        if (pgCourses.length > 0) {
          response += `\n**${dept.name}:**\n`;
          pgCourses.forEach(course => {
            response += `• ${course.name} (${course.duration}, ${course.seats} seats)\n`;
          });
        }
      });
    }

    // Additional programs from admissions
    response += `\n**Additional Programs:**\n`;
    collegeData.admissions.programs.forEach(program => {
      response += `• ${program.name} - ${program.description} (${program.duration})\n`;
    });

    response += `\n**Summary:**\n`;
    response += `• Total Undergraduate Programs: ${this.countCourses('undergraduate')}\n`;
    response += `• Total Postgraduate Programs: ${this.countCourses('postgraduate')}\n`;
    response += `• Total Seats Available: ${this.countTotalSeats()}\n`;
    response += `• Total Departments: ${collegeData.departments.length}\n\n`;

    response += `💡 *You can ask about:\n• "courses in Computer Science" (specific department)\n• "undergraduate programs only"\n• "fee structure for B.Sc IT"\n• "placement statistics for IT department"\n• "eligibility for B.Com"*`;

    return response;
  }

  countCourses(level) {
    let count = 0;
    collegeData.departments.forEach(dept => {
      dept.courses.forEach(course => {
        if (level === 'undergraduate' && (course.name.includes('B.') || course.name.includes('Bachelor'))) {
          count++;
        } else if (level === 'postgraduate' && (course.name.includes('M.') || course.name.includes('Master'))) {
          count++;
        }
      });
    });
    return count;
  }

  countTotalSeats() {
    let totalSeats = 0;
    collegeData.departments.forEach(dept => {
      dept.courses.forEach(course => {
        totalSeats += course.seats;
      });
    });
    return totalSeats;
  }

  generateDepartmentsResponse() {
    const departments = collegeData.departments;
    
    let response = `**Academic Departments at RJ College** 📚\n\n`;
    response += `The college has **${departments.length} major academic departments**:\n\n`;

    departments.forEach((dept, index) => {
      response += `${index + 1}. **${dept.name}**\n`;
      response += `   👨‍🏫 Head: ${dept.head.name}\n`;
      response += `   📅 Established: ${dept.established}\n`;
      response += `   👥 Faculty: ${dept.faculty_count} members\n`;
      response += `   🎓 Students: ${dept.student_strength}\n`;
      response += `   🎯 Accreditation: ${dept.accreditation}\n`;
      response += `   📖 ${dept.description}\n\n`;
    });

    response += `💡 *Ask about specific departments like:\n• "Tell me about IT department"\n• "Computer Science department head"\n• "Courses in Biotechnology department"\n• "Placements for Management department"\n• "Facilities in Science department"*`;

    return response;
  }

  generateDepartmentDetailsResponse(departmentName) {
    if (!departmentName) {
      return "Which department would you like to know about? You can ask about IT, Computer Science, Biotechnology, Management, Arts, Science, or Commerce department.";
    }

    const department = collegeData.departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!department) {
      return `I couldn't find details for "${departmentName}". Available departments are: ${collegeData.departments.map(d => d.name).join(', ')}`;
    }

    let response = `**${department.name} Department** 🏛️\n\n`;
    response += `**Department Head:** ${department.head.name}\n`;
    response += `**Qualification:** ${department.head.qualification}\n`;
    response += `**Specialization:** ${department.head.specialization}\n`;
    response += `**Email:** ${department.head.email}\n`;
    response += `**Phone:** ${department.head.phone}\n\n`;
    
    response += `**Established:** ${department.established}\n`;
    response += `**Faculty Strength:** ${department.faculty_count} members\n`;
    response += `**Student Strength:** ${department.student_strength} students\n`;
    response += `**Accreditation:** ${department.accreditation}\n\n`;
    
    response += `**Description:** ${department.description}\n\n`;
    
    response += `**Research Areas:** ${department.research_areas.join(', ')}\n\n`;
    
    response += `**Facilities:** ${department.facilities.join(', ')}\n\n`;
    
    response += `**Industry Partnerships:** ${department.industry_partnerships.join(', ')}\n\n`;
    
    response += `**Laboratories:** ${department.labs.join(', ')}\n\n`;
    
    response += `**Programs Offered:**\n`;
    department.courses.forEach(course => {
      response += `• ${course.name} (${course.duration}, ${course.seats} seats)\n`;
    });

    return response;
  }

  generateDepartmentHeadResponse(departmentName) {
    if (!departmentName) {
      return "Please specify which department head you're asking about. For example: 'Who is head of IT department?' or 'Computer Science department head'";
    }

    const department = collegeData.departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!department) {
      return `Department "${departmentName}" not found. Available departments: ${collegeData.departments.map(d => d.name).join(', ')}`;
    }

    const head = department.head;
    
    let response = `**Head of ${department.name} Department** 👨‍🏫\n\n`;
    response += `**Name:** ${head.name}\n`;
    response += `**Qualification:** ${head.qualification}\n`;
    response += `**Experience:** ${head.experience}\n`;
    response += `**Specialization:** ${head.specialization}\n`;
    response += `**Email:** ${head.email}\n`;
    response += `**Phone:** ${head.phone}\n\n`;
    
    response += `*${head.name} leads the ${department.name} department with ${department.faculty_count} faculty members and ${department.student_strength} students.*`;

    return response;
  }

  generateDepartmentFacilitiesResponse(departmentName) {
    if (!departmentName) {
      return "Please specify which department's facilities you're interested in. For example: 'IT department facilities' or 'facilities in Computer Science'";
    }

    const department = collegeData.departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!department) {
      return `Department "${departmentName}" not found. Available departments: ${collegeData.departments.map(d => d.name).join(', ')}`;
    }

    let response = `**Facilities in ${department.name} Department** 🏫\n\n`;
    
    response += `**Laboratories:**\n`;
    department.labs.forEach((lab, index) => {
      response += `${index + 1}. ${lab}\n`;
    });
    
    response += `\n**Additional Facilities:**\n`;
    department.facilities.forEach((facility, index) => {
      response += `${index + 1}. ${facility}\n`;
    });
    
    response += `\n**Research Areas:** ${department.research_areas.join(', ')}\n\n`;
    
    response += `**Industry Partnerships:** ${department.industry_partnerships.join(', ')}\n\n`;
    
    response += `💡 *The ${department.name} department is equipped with modern facilities to provide hands-on learning experience and research opportunities.*`;

    return response;
  }

  generateDepartmentCoursesResponse(departmentName) {
    if (!departmentName) {
      return "Please specify which department's courses you're interested in. For example: 'IT department courses' or 'Computer Science programs'.";
    }

    const department = collegeData.departments.find(
      dept => dept.name.toLowerCase() === departmentName.toLowerCase()
    );

    if (!department) {
      return `Department "${departmentName}" not found. Available departments: ${collegeData.departments.map(d => d.name).join(', ')}`;
    }

    let response = `**Courses in ${department.name} Department** 🎓\n\n`;

    department.courses.forEach(course => {
      response += `**${course.name}**\n`;
      response += `   📅 Duration: ${course.duration}\n`;
      response += `   🪑 Seats: ${course.seats}\n`;
      response += `   ✅ Eligibility: ${course.eligibility}\n`;
      response += `   💰 Fees: ${course.fees.total} per year\n\n`;
    });

    response += `💡 *For detailed syllabus and admission process, contact the department office at ${department.head.email} or ${department.head.phone}*`;

    return response;
  }

  generateCourseDetailsResponse(courseName) {
    if (!courseName) {
      return "Which course would you like to know about? Please specify the course name like 'B.Sc IT' or 'M.Sc Computer Science'.";
    }

    // Find course across all departments
    for (const department of collegeData.departments) {
      const course = department.courses.find(c => 
        c.name.toLowerCase().includes(courseName.toLowerCase())
      );
      
      if (course) {
        let response = `**${course.name}** 📚\n\n`;
        response += `**Department:** ${department.name}\n`;
        response += `**Duration:** ${course.duration}\n`;
        response += `**Seats Available:** ${course.seats}\n`;
        response += `**Eligibility:** ${course.eligibility}\n`;
        
        if (course.fees) {
          response += `**Fee Structure (Per Year):**\n`;
          response += `• Tuition Fee: ${course.fees.tuition}\n`;
          if (course.fees.development) response += `• Development Fee: ${course.fees.development}\n`;
          if (course.fees.laboratory) response += `• Laboratory Fee: ${course.fees.laboratory}\n`;
          if (course.fees.activity) response += `• Activity Fee: ${course.fees.activity}\n`;
          response += `• **Total: ${course.fees.total} per year**\n`;
        }
        
        if (course.syllabus) {
          response += `\n**Key Subjects:** ${course.syllabus.slice(0, 5).join(', ')}...\n`;
        }
        
        response += `\n**Department Facilities:** ${department.facilities?.join(', ') || 'Well-equipped labs'}\n`;
        response += `\n💡 *For complete syllabus and admission details, visit the college website or contact ${department.head.name} at ${department.head.email}*`;
        
        return response;
      }
    }

    return `I couldn't find details for "${courseName}". Available courses include B.Sc IT, B.Sc Computer Science, B.Com, BMS, BBA, and various postgraduate programs.`;
  }

  generateCourseFeesResponse(courseName) {
    if (!courseName) {
      return "Which course fees would you like to know? Please specify the course name like 'B.Sc IT fees' or 'MBA course fees'.";
    }

    // Find course across all departments
    for (const department of collegeData.departments) {
      const course = department.courses.find(c => 
        c.name.toLowerCase().includes(courseName.toLowerCase())
      );
      
      if (course) {
        let response = `**Fee Structure - ${course.name}** 💰\n\n`;
        response += `**Department:** ${department.name}\n`;
        response += `**Duration:** ${course.duration}\n\n`;
        
        response += `**Fee Breakdown (Per Year):**\n`;
        response += `• Tuition Fee: ${course.fees.tuition}\n`;
        if (course.fees.development) response += `• Development Fee: ${course.fees.development}\n`;
        if (course.fees.laboratory) response += `• Laboratory Fee: ${course.fees.laboratory}\n`;
        if (course.fees.activity) response += `• Activity Fee: ${course.fees.activity}\n`;
        response += `• **Total: ${course.fees.total} per year**\n\n`;
        
        const yearlyFee = parseInt(course.fees.total.replace(/[^0-9]/g, ''));
        const durationYears = parseInt(course.duration);
        response += `**Total Course Fee:** Approximately ₹${yearlyFee * durationYears} for ${course.duration}\n\n`;
        
        response += `**Additional Charges:**\n`;
        response += `• Admission Form: ₹500 (One-time)\n`;
        response += `• Examination Fee: As per university norms\n`;
        response += `• Library Deposit: ₹1000 (Refundable)\n`;
        response += `• Identity Card: ₹200\n\n`;
        
        response += `**Payment Schedule:**\n`;
        response += `• 60% at admission\n`;
        response += `• 40% before second semester\n\n`;
        
        response += `💡 *Scholarships and financial aid available for eligible students. Ask about "scholarships" for more information.*`;

        return response;
      }
    }

    return `I couldn't find fee details for "${courseName}". Available courses include B.Sc IT, B.Sc Computer Science, B.Com, BMS, BBA, and various postgraduate programs.`;
  }

  generateCourseEligibilityResponse(courseName) {
    if (!courseName) {
      return "Which course eligibility would you like to know? Please specify the course name like 'B.Sc IT eligibility' or 'MBA course requirements'.";
    }

    for (const department of collegeData.departments) {
      const course = department.courses.find(c => 
        c.name.toLowerCase().includes(courseName.toLowerCase())
      );
      
      if (course) {
        let response = `**Eligibility Criteria - ${course.name}** ✅\n\n`;
        response += `**Department:** ${department.name}\n`;
        response += `**Duration:** ${course.duration}\n\n`;
        
        response += `**Basic Eligibility:**\n`;
        response += `${course.eligibility}\n\n`;
        
        response += `**Required Documents:**\n`;
        collegeData.admissions.eligibility.documents_required.forEach((doc, index) => {
          response += `${index + 1}. ${doc}\n`;
        });
        
        response += `\n**Selection Process:**\n`;
        response += `• Based on merit of qualifying examination\n`;
        response += `• Personal interview for some courses\n`;
        response += `• Entrance test for postgraduate programs\n\n`;
        
        response += `**Important Notes:**\n`;
        response += `• Minimum 45% marks required for general category\n`;
        response += `• 5% relaxation for SC/ST candidates\n`;
        response += `• Provisional admission for appearing students\n\n`;
        
        response += `💡 *For detailed eligibility and reservation policies, contact admission cell at ${collegeData.admissions.contact.email}*`;

        return response;
      }
    }

    return `I couldn't find eligibility details for "${courseName}".`;
  }

  generateCourseSyllabusResponse(courseName) {
    if (!courseName) {
      return "Which course syllabus would you like to know? Please specify the course name like 'B.Sc IT syllabus' or 'MBA subjects'.";
    }

    for (const department of collegeData.departments) {
      const course = department.courses.find(c => 
        c.name.toLowerCase().includes(courseName.toLowerCase())
      );
      
      if (course && course.syllabus) {
        let response = `**Syllabus - ${course.name}** 📖\n\n`;
        response += `**Department:** ${department.name}\n`;
        response += `**Duration:** ${course.duration}\n\n`;
        
        response += `**Subjects Covered:**\n`;
        course.syllabus.forEach((subject, index) => {
          response += `${index + 1}. ${subject}\n`;
        });
        
        response += `\n**Teaching Methodology:**\n`;
        response += `• Classroom lectures and discussions\n`;
        response += `• Laboratory practical sessions\n`;
        response += `• Project work and assignments\n`;
        response += `• Industry visits and guest lectures\n`;
        response += `• Research projects and seminars\n\n`;
        
        response += `**Evaluation Pattern:**\n`;
        response += `• Internal Assessment: 40%\n`;
        response += `• End Semester Examination: 60%\n`;
        response += `• Practical examinations for relevant courses\n\n`;
        
        response += `💡 *For detailed semester-wise syllabus and course structure, contact ${department.head.name} at ${department.head.email}*`;

        return response;
      }
    }

    return `I couldn't find syllabus details for "${courseName}". Please contact the respective department for detailed curriculum information.`;
  }

  generateCourseCareerResponse(courseName) {
    if (!courseName) {
      return "Which course career opportunities would you like to know? Please specify the course name like 'B.Sc IT career' or 'MBA job opportunities'.";
    }

    for (const department of collegeData.departments) {
      const course = department.courses.find(c => 
        c.name.toLowerCase().includes(courseName.toLowerCase())
      );
      
      if (course && course.career_opportunities) {
        let response = `**Career Opportunities - ${course.name}** 💼\n\n`;
        response += `**Department:** ${department.name}\n\n`;
        
        response += `**Job Roles:**\n`;
        course.career_opportunities.forEach((role, index) => {
          response += `${index + 1}. ${role}\n`;
        });
        
        response += `\n**Industries:**\n`;
        response += `${department.industry_partnerships.join(', ')}\n\n`;
        
        response += `**Higher Education Options:**\n`;
        response += `• Master's Degree in relevant field\n`;
        response += `• Professional certifications\n`;
        response += `• Research programs (M.Phil/PhD)\n`;
        response += `• Management courses (MBA)\n\n`;
        
        response += `**Placement Support:**\n`;
        response += `• Campus placement training\n`;
        response += `• Resume building workshops\n`;
        response += `• Mock interviews and GD sessions\n`;
        response += `• Industry interaction programs\n\n`;
        
        response += `💡 *For current placement statistics and company details, ask about "placement statistics for ${department.name}"*`;

        return response;
      }
    }

    return `I couldn't find specific career information for "${courseName}". Generally, all courses at RJ College provide excellent career opportunities with strong industry connections.`;
  }

  generateDepartmentHeadInfo(departmentName) {
    return this.generateDepartmentHeadResponse(departmentName);
  }

  // ========== ADMISSION METHODS ==========

  generateAdmissionsInfo() {
    const admissions = collegeData.admissions;
    
    let response = `**Admissions ${admissions.year} - RJ College** 📝\n\n`;
    
    response += `**Admission Process:** ${admissions.process}\n\n`;
    
    response += `**Application Fee:**\n`;
    response += `• Undergraduate: ${admissions.application_fee.undergraduate}\n`;
    response += `• Postgraduate: ${admissions.application_fee.postgraduate}\n`;
    response += `• Diploma: ${admissions.application_fee.diploma}\n`;
    response += `• International: ${admissions.application_fee.international}\n\n`;
    
    response += `**Available Programs:**\n`;
    admissions.programs.forEach((program, index) => {
      response += `${index + 1}. **${program.name}**\n`;
      response += `   ${program.description}\n`;
      response += `   Duration: ${program.duration} | Fees: ${program.fees}\n\n`;
    });

    response += `**Application Steps:**\n`;
    response += `1. Visit college website: ${collegeData.contact.website}\n`;
    response += `2. Go to 'Admissions ${admissions.year}' section\n`;
    response += `3. Register and fill online application\n`;
    response += `4. Upload required documents\n`;
    response += `5. Pay application fee online\n`;
    response += `6. Submit and note reference number\n\n`;

    response += `**Admission Cell Contact:**\n`;
    response += `👨‍💼 ${admissions.contact.admission_officer}\n`;
    response += `📞 ${admissions.contact.admission_cell}\n`;
    response += `📧 ${admissions.contact.email}\n`;
    response += `⏰ ${admissions.contact.hours}\n`;
    response += `📱 Helpline: ${admissions.contact.helpline}\n`;
    response += `📍 ${admissions.contact.address}\n`;

    return response;
  }

  generateAdmissionDates() {
    const dates = collegeData.admissions.important_dates;
    
    let response = `**Important Admission Dates ${collegeData.admissions.year}** 📅\n\n`;
    
    response += `**Application Start:** ${dates.application_start}\n`;
    response += `**Application End:** ${dates.application_end}\n`;
    response += `**First Merit List:** ${dates.merit_list_first}\n`;
    response += `**Second Merit List:** ${dates.merit_list_second}\n`;
    response += `**Admission Confirmation:** ${dates.admission_confirmation}\n`;
    response += `**Classes Commence:** ${dates.classes_start}\n`;
    response += `**Late Admission:** ${dates.late_admission}\n\n`;
    
    response += `**Required Documents:**\n`;
    collegeData.admissions.eligibility.documents_required.forEach((doc, index) => {
      response += `${index + 1}. ${doc}\n`;
    });
    
    response += `\n💡 *These dates are tentative. Please check the college website regularly for updates and notifications.*`;

    return response;
  }

  generateAdmissionEligibility() {
    const eligibility = collegeData.admissions.eligibility;
    
    let response = `**Admission Eligibility Criteria** ✅\n\n`;
    
    response += `**Undergraduate Programs:**\n`;
    response += `${eligibility.undergraduate}\n\n`;
    
    response += `**Postgraduate Programs:**\n`;
    response += `${eligibility.postgraduate}\n\n`;
    
    response += `**International Students:**\n`;
    response += `${eligibility.international}\n\n`;
    
    response += `**Relaxation:** ${eligibility.relaxation}\n`;
    response += `**Age Limit:** ${eligibility.age_limit}\n\n`;
    
    response += `**Entrance Exams:**\n`;
    for (const [program, exam] of Object.entries(eligibility.entrance_exams)) {
      response += `• ${program}: ${exam}\n`;
    }
    
    response += `\n**Documents Required:**\n`;
    eligibility.documents_required.forEach((doc, index) => {
      response += `${index + 1}. ${doc}\n`;
    });
    
    response += `\n**Selection Criteria:**\n`;
    response += `• Merit-based on qualifying examination\n`;
    response += `• Entrance test for some programs\n`;
    response += `• Personal interview for management courses\n`;
    response += `• Portfolio evaluation for specific programs\n\n`;
    
    response += `💡 *For program-specific eligibility, ask about particular courses like "B.Sc IT eligibility"*`;

    return response;
  }

  generateAdmissionContact() {
    const contact = collegeData.admissions.contact;
    
    let response = `**Admission Cell Contact Information** 📞\n\n`;
    
    response += `**Admission Officer:** ${contact.admission_officer}\n`;
    response += `**Phone:** ${contact.admission_cell}\n`;
    response += `**Helpline:** ${contact.helpline}\n`;
    response += `**International Cell:** ${contact.international_cell}\n`;
    response += `**Email:** ${contact.email}\n`;
    response += `**Working Hours:** ${contact.hours}\n`;
    response += `**Location:** ${contact.address}\n\n`;
    
    response += `**Services Provided:**\n`;
    response += `• Admission guidance and counseling\n`;
    response += `• Application process assistance\n`;
    response += `• Document verification\n`;
    response += `• Fee payment guidance\n`;
    response += `• International student support\n\n`;
    
    response += `💡 *Visit the admission cell during working hours for personalized assistance with your admission process.*`;

    return response;
  }

  generateAdmissionDocuments() {
    const documents = collegeData.admissions.eligibility.documents_required;
    
    let response = `**Required Documents for Admission** 📄\n\n`;
    
    response += `**Mandatory Documents:**\n`;
    documents.forEach((doc, index) => {
      response += `${index + 1}. ${doc}\n`;
    });
    
    response += `\n**Additional Notes:**\n`;
    response += `• All documents must be original for verification\n`;
    response += `• Photocopies should be self-attested\n`;
    response += `• Recent passport size photographs required\n`;
    response += `• Gap certificate needed if applicable\n`;
    response += `• Transfer certificate from previous institution\n`;
    response += `• Migration certificate for other university students\n\n`;
    
    response += `**Document Submission:**\n`;
    response += `• Submit during admission confirmation\n`;
    response += `• Keep extra copies for your reference\n`;
    response += `• International students need additional documents\n\n`;
    
    response += `💡 *For any document-related queries, contact admission cell at ${collegeData.admissions.contact.email}*`;

    return response;
  }

  // ========== PLACEMENT METHODS ==========

  generatePlacementStatsResponse(departmentName) {
    const placements = collegeData.placements;
    
    let response = `**Placement Statistics ${placements.overall_stats.academic_year}** 📊\n\n`;
    
    if (departmentName) {
      const deptPlacement = placements.department_wise_placements[departmentName];
      if (deptPlacement) {
        response += `**${departmentName} Department Placements:**\n\n`;
        response += `• **Students Placed:** ${deptPlacement.placed}/${deptPlacement.total}\n`;
        response += `• **Placement Percentage:** ${deptPlacement.percentage}%\n`;
        response += `• **Highest Package:** ${deptPlacement.highest_package}\n`;
        response += `• **Average Package:** ${deptPlacement.average_package}\n`;
        response += `• **Top Recruiters:** ${deptPlacement.top_recruiters.join(', ')}\n`;
        
        response += `\n💡 *${departmentName} department has excellent placement record with ${deptPlacement.percentage}% students placed in top companies.*`;
        return response;
      } else {
        response += `No specific placement data found for ${departmentName}. Here are overall statistics:\n\n`;
      }
    }
    
    if (!departmentName || !placements.department_wise_placements[departmentName]) {
      response += `**Overall College Placements:**\n\n`;
      response += `• **Total Students:** ${placements.overall_stats.total_students}\n`;
      response += `• **Placed Students:** ${placements.overall_stats.placed_students}\n`;
      response += `• **Placement Percentage:** ${placements.overall_stats.placement_percentage}%\n`;
      response += `• **Highest Package:** ${placements.overall_stats.highest_package}\n`;
      response += `• **Average Package:** ${placements.overall_stats.average_package}\n`;
      response += `• **Median Package:** ${placements.overall_stats.median_package}\n`;
      response += `• **Recruiting Companies:** ${placements.overall_stats.recruiting_companies}\n`;
      response += `• **Internship Offers:** ${placements.overall_stats.internship_offers}\n`;
    }
    
    response += `\n**Placement Cell Contact:**\n`;
    response += `👨‍💼 ${placements.placement_cell.head}\n`;
    response += `📧 ${placements.placement_cell.email}\n`;
    response += `📞 ${placements.placement_cell.phone}\n`;
    response += `⏰ ${placements.placement_cell.office_hours}\n`;
    response += `📍 ${placements.placement_cell.location}\n`;

    return response;
  }

  generatePlacementCompaniesResponse(departmentName) {
    const placements = collegeData.placements;
    
    let response = `**Top Recruiting Companies** 🏢\n\n`;
    
    if (departmentName && placements.department_wise_placements[departmentName]) {
      const deptPlacement = placements.department_wise_placements[departmentName];
      response += `**Top Companies for ${departmentName}:**\n\n`;
      deptPlacement.top_recruiters.forEach((company, index) => {
        response += `${index + 1}. ${company}\n`;
      });
    } else {
      response += `**Overall Top Recruiters:**\n\n`;
      placements.top_recruiters.slice(0, 15).forEach((company, index) => {
        response += `${index + 1}. ${company}\n`;
      });
      if (placements.top_recruiters.length > 15) {
        response += `\n...and ${placements.top_recruiters.length - 15} more companies\n`;
      }
    }
    
    response += `\n**Total Companies Visiting:** ${placements.overall_stats.recruiting_companies} companies\n\n`;
    response += `💡 *Companies visit regularly for:\n• Campus Placements\n• Summer Internships\n• Live Projects\n• Industry Training Programs*`;

    return response;
  }

  generatePlacementProcess() {
    const process = collegeData.placements.placement_process;
    
    let response = `**Placement Process & Timeline** ⏰\n\n`;
    
    response += `**Annual Timeline:**\n`;
    for (const [stage, timeline] of Object.entries(process.timeline)) {
      response += `• ${stage.charAt(0).toUpperCase() + stage.slice(1)}: ${timeline}\n`;
    }
    
    response += `\n**Training Provided:**\n`;
    process.training_provided.forEach((training, index) => {
      response += `${index + 1}. ${training}\n`;
    });
    
    response += `\n**Internship Opportunities:**\n`;
    process.internship_opportunities.forEach((internship, index) => {
      response += `${index + 1}. ${internship}\n`;
    });
    
    response += `\n**Placement Cell Services:**\n`;
    collegeData.placements.placement_cell.services.forEach((service, index) => {
      response += `${index + 1}. ${service}\n`;
    });
    
    response += `\n**Contact Placement Cell:**\n`;
    response += `📧 ${collegeData.placements.placement_cell.email}\n`;
    response += `📞 ${collegeData.placements.placement_cell.phone}\n`;
    response += `👨‍💼 ${collegeData.placements.placement_cell.head}\n`;
    response += `📍 ${collegeData.placements.placement_cell.location}\n`;

    return response;
  }

  generatePlacementContact() {
    const placement = collegeData.placements.placement_cell;
    
    let response = `**Placement Cell Contact Information** 💼\n\n`;
    
    response += `**Head:** ${placement.head}\n`;
    response += `**Email:** ${placement.email}\n`;
    response += `**Phone:** ${placement.phone}\n`;
    response += `**Office Hours:** ${placement.office_hours}\n`;
    response += `**Location:** ${placement.location}\n\n`;
    
    response += `**Services Provided:**\n`;
    placement.services.forEach((service, index) => {
      response += `${index + 1}. ${service}\n`;
    });
    
    response += `\n**Students can contact placement cell for:**\n`;
    response += `• Placement registration and profile creation\n`;
    response += `• Resume building and interview preparation\n`;
    response += `• Internship opportunities and guidance\n`;
    response += `• Career counseling and guidance\n`;
    response += `• Company-specific preparation\n\n`;
    
    response += `💡 *Visit the placement cell during office hours for personalized career guidance and placement assistance.*`;

    return response;
  }

  generatePlacementTraining() {
    const training = collegeData.placements.placement_process.training_provided;
    
    let response = `**Placement Training & Preparation** 🎯\n\n`;
    
    response += `**Training Programs:**\n`;
    training.forEach((program, index) => {
      response += `${index + 1}. ${program}\n`;
    });
    
    response += `\n**Training Schedule:**\n`;
    response += `• Regular sessions throughout the academic year\n`;
    response += `• Special workshops before placement season\n`;
    response += `• One-on-one counseling sessions\n`;
    response += `• Mock tests and practice sessions\n\n`;
    
    response += `**Training Methodology:**\n`;
    response += `• Classroom training by industry experts\n`;
    response += `• Online assessment and feedback\n`;
    response += `• Group discussion practice\n`;
    response += `• Mock interview sessions\n`;
    response += `• Resume building workshops\n\n`;
    
    response += `**Certification:**\n`;
    response += `• Soft skills certification\n`;
    response += `• Technical skills assessment\n`;
    response += `• Communication skills evaluation\n`;
    response += `• Leadership training completion\n\n`;
    
    response += `💡 *All training programs are included in the course curriculum at no additional cost to students.*`;

    return response;
  }

  // ========== FINANCIAL METHODS ==========

  generateFeeStructureResponse(departmentName, courseName) {
    if (courseName) {
      return this.generateCourseFeesResponse(courseName);
    }
    
    if (departmentName) {
      const department = collegeData.departments.find(
        dept => dept.name.toLowerCase() === departmentName.toLowerCase()
      );
      
      if (department) {
        let response = `**Fee Structure - ${department.name} Department** 💰\n\n`;
        
        department.courses.forEach(course => {
          response += `**${course.name}**\n`;
          response += `• Duration: ${course.duration}\n`;
          response += `• Total Fees: ${course.fees.total} per year\n`;
          response += `• Eligibility: ${course.eligibility}\n\n`;
        });
        
        return response;
      }
    }
    
    // General fee structure
    let response = `**General Fee Structure Overview** 💰\n\n`;
    
    response += `**Undergraduate Programs:**\n`;
    response += `• B.Sc Programs: ₹15,000 - ₹27,500 per year\n`;
    response += `• B.Com: ₹15,500 per year\n`;
    response += `• BMS/BBA: ₹25,000 - ₹27,000 per year\n`;
    response += `• B.A Programs: ₹13,500 per year\n\n`;
    
    response += `**Postgraduate Programs:**\n`;
    response += `• M.Sc Programs: ₹22,000 - ₹39,000 per year\n`;
    response += `• M.Com: ₹20,000 per year\n`;
    response += `• M.A Programs: ₹20,000 per year\n\n`;
    
    response += `**Additional Programs:**\n`;
    response += `• Postgraduate Diploma: ₹20,000 - ₹25,000\n`;
    response += `• Junior College (FYJC): ₹12,000 per year\n`;
    response += `• PhD Programs: ₹30,000 - ₹50,000 per year\n\n`;
    
    response += `**Additional Fees:**\n`;
    response += `• Admission Form: ₹500\n`;
    response += `• Examination Fee: As per university\n`;
    response += `• Laboratory Fees: For science courses\n`;
    response += `• Library Deposit: ₹1000 (Refundable)\n`;
    response += `• Identity Card: ₹200\n`;
    response += `• Development Fee: As applicable\n\n`;
    
    response += `💡 *For exact fee structure of specific courses, ask like "B.Sc IT fees" or "MBA course fees". Scholarships available for eligible students.*`;

    return response;
  }

  generateScholarshipsInfo() {
    const scholarships = collegeData.scholarships;
    
    let response = `**Scholarships and Financial Aid** 💸\n\n`;
    
    scholarships.forEach((scholarship, index) => {
      response += `**${index + 1}. ${scholarship.name}**\n`;
      response += `• **Eligibility:** ${scholarship.eligibility}\n`;
      response += `• **Amount:** ${scholarship.amount}\n`;
      if (scholarship.application_period) {
        response += `• **Application Period:** ${scholarship.application_period}\n`;
      }
      if (scholarship.documents_required) {
        response += `• **Documents Required:** ${scholarship.documents_required.join(', ')}\n`;
      }
      response += `\n`;
    });
    
    response += `**How to Apply:**\n`;
    response += `1. Check eligibility criteria\n`;
    response += `2. Collect required documents\n`;
    response += `3. Submit application through college portal\n`;
    response += `4. Application verification\n`;
    response += `5. Scholarship disbursement\n\n`;
    
    response += `**Contact for Scholarships:**\n`;
    response += `📞 Admission Cell: ${collegeData.admissions.contact.admission_cell}\n`;
    response += `📧 Email: ${collegeData.admissions.contact.email}\n`;
    response += `👨‍💼 Officer: ${collegeData.admissions.contact.admission_officer}\n`;

    return response;
  }

  
  generateFinancialAidInfo() {
    return `**Financial Assistance Programs** 🤝\n\n
**Available Support:**\n
• **Education Loans:** Tie-ups with leading banks for student loans\n
• **Fee Installments:** Flexible payment options available\n
• **Work-Study Programs:** On-campus employment opportunities\n
• **Emergency Funds:** Financial support for emergencies\n
• **Book Bank:** Free textbook lending library\n
• **Transport Concession:** Discounted bus/train passes\n\n

**Eligibility:**\n
• Students from economically weaker sections\n
• Academic merit holders\n
• Special category students (SC/ST/OBC)\n
• Physically challenged students\n
• Orphan students\n\n

**Application Process:**\n
1. Submit application with required documents\n
2. Interview with financial aid committee\n
3. Document verification\n
4. Approval and disbursement\n\n

**Contact:**\n
📞 Accounts Department: ${collegeData.contact.phone.accounts}\n
📧 Email: ${collegeData.contact.email.accounts}\n
⏰ Office Hours: ${collegeData.contact.working_hours.office}\n\n

💡 *No deserving student is denied education due to financial constraints. Multiple support options available.*`;
  }

  // ========== FACILITIES METHODS ==========

  generateFacilitiesInfo() {
    const facilities = collegeData.facilities;
    
    let response = `**College Facilities & Infrastructure** 🏫\n\n`;
    
    facilities.forEach(facility => {
      response += `**${facility.name}**\n`;
      response += `${facility.description}\n`;
      response += `⏰ Timing: ${facility.timing}\n`;
      if (facility.capacity) {
        response += `👥 Capacity: ${facility.capacity}\n`;
      }
      if (facility.features) {
        response += `⭐ Features: ${facility.features.join(', ')}\n`;
      }
      if (facility.contact) {
        response += `📞 Contact: ${facility.contact}\n`;
      }
      response += `\n`;
    });

    response += `*All facilities are maintained to highest standards and regularly upgraded for student benefit.*`;

    return response;
  }

  generateInfrastructureInfo() {
    const info = collegeData.college_info;
    
    let response = `**College Infrastructure Overview** 🏛️\n\n`;
    
    response += `**Campus Size:** ${info.campus_size}\n`;
    response += `**Buildings:** Multiple academic and administrative blocks\n\n`;
    
    response += `**Academic Infrastructure:**\n`;
    response += `• Classrooms: ${info.classrooms} smart classrooms\n`;
    response += `• Laboratories: ${info.laboratories} well-equipped labs\n`;
    response += `• Computer Labs: ${info.computer_labs} with latest technology\n`;
    response += `• Auditoriums: ${info.auditoriums} with modern facilities\n\n`;
    
    response += `**Sports Infrastructure:**\n`;
    response += `• Sports Grounds: ${info.sports_grounds}\n`;
    response += `• Indoor Sports Complex\n`;
    response += `• Gymnasium and Fitness Center\n`;
    response += `• Swimming Pool\n\n`;
    
    response += `**Special Features:**\n`;
    info.special_features.forEach((feature, index) => {
      response += `${index + 1}. ${feature}\n`;
    });
    
    response += `\n**Technology Infrastructure:**\n`;
    response += `• WiFi enabled campus\n`;
    response += `• Digital classrooms with projectors\n`;
    response += `• Computer centers with high-speed internet\n`;
    response += `• Online learning management system\n`;
    response += `• Digital library resources\n\n`;
    
    response += `💡 *The college continuously upgrades infrastructure to provide world-class learning environment.*`;

    return response;
  }

  generateLibraryInfo() {
    const library = collegeData.facilities.find(f => f.name === 'Central Library');
    
    let response = `**Central Library** 📚\n\n`;
    
    if (library) {
      response += `${library.description}\n\n`;
      response += `**Timing:** ${library.timing}\n`;
      response += `**Capacity:** ${library.capacity}\n\n`;
      
      response += `**Features:**\n`;
      library.features.forEach((feature, index) => {
        response += `${index + 1}. ${feature}\n`;
      });
      
      response += `\n**Collection:**\n`;
      response += `• Books: 75,000+\n`;
      response += `• Journals: 150+\n`;
      response += `• E-books: 10,000+\n`;
      response += `• Online Databases: Multiple\n`;
      response += `• Reference Section: Comprehensive\n\n`;
      
      response += `**Services:**\n`;
      response += `• Book lending and reference\n`;
      response += `• Digital resource access\n`;
      response += `• Reading rooms and study spaces\n`;
      response += `• Research assistance\n`;
      response += `• Inter-library loan\n\n`;
      
      response += `**Contact:** ${library.contact}\n`;
    }
    
    return response;
  }

  generateHostelInfo() {
    const hostel = collegeData.facilities.find(f => f.name === 'Hostel Facilities');
    
    let response = `**Hostel Facilities** 🏠\n\n`;
    
    if (hostel) {
      response += `${hostel.description}\n\n`;
      response += `**Capacity:** ${hostel.capacity}\n\n`;
      
      response += `**Features:**\n`;
      hostel.features.forEach((feature, index) => {
        response += `${index + 1}. ${feature}\n`;
      });
      
      response += `\n**Room Types:**\n`;
      response += `• Single Occupancy AC Rooms\n`;
      response += `• Single Occupancy Non-AC Rooms\n`;
      response += `• Double Occupancy AC Rooms\n`;
      response += `• Double Occupancy Non-AC Rooms\n\n`;
      
      response += `**Amenities:**\n`;
      response += `• Hygienic mess with variety of food\n`;
      response += `• Common room with TV and games\n`;
      response += `• Reading room and study area\n`;
      response += `• Laundry facilities\n`;
      response += `• 24/7 security and surveillance\n`;
      response += `• Medical assistance\n`;
      response += `• WiFi connectivity\n\n`;
      
      response += `**Fee Structure:**\n`;
      response += `• AC Room: ₹80,000 per year\n`;
      response += `• Non-AC Room: ₹60,000 per year\n`;
      response += `• Mess Charges: ₹45,000 per year\n\n`;
      
      response += `**Contact:** ${hostel.contact}\n`;
    }
    
    return response;
  }

  generateSportsInfo() {
    const sports = collegeData.facilities.find(f => f.name === 'Sports Complex');
    
    let response = `**Sports Complex** ⚽\n\n`;
    
    if (sports) {
      response += `${sports.description}\n\n`;
      response += `**Timing:** ${sports.timing}\n\n`;
      
      response += `**Facilities:**\n`;
      sports.features.forEach((facility, index) => {
        response += `${index + 1}. ${facility}\n`;
      });
      
      response += `\n**Indoor Games:**\n`;
      response += `• Table Tennis\n`;
      response += `• Chess\n`;
      response += `• Carrom\n`;
      response += `• Badminton\n`;
      response += `• Gymnasium\n\n`;
      
      response += `**Outdoor Games:**\n`;
      response += `• Cricket\n`;
      response += `• Football\n`;
      response += `• Basketball\n`;
      response += `• Volleyball\n`;
      response += `• Athletics Track\n\n`;
      
      response += `**Training:**\n`;
      response += `• Professional coaches\n`;
      response += `• Regular practice sessions\n`;
      response += `• Inter-college tournaments\n`;
      response += `• Annual sports day\n`;
      response += `• Sports scholarships\n\n`;
      
      response += `**Contact:** ${sports.contact}\n`;
    }
    
    return response;
  }


generateNEPOverview() {
  const nep = collegeData.nep_implementation;
  
  let response = `**National Education Policy (NEP) 2020 at RJ College** 🎓\n\n`;
  
  response += `**Overview:**\n${nep.overview}\n\n`;
  
  response += `**Implementation Timeline:**\n`;
  for (const [year, phase] of Object.entries(nep.implementation_timeline)) {
    response += `• **${year}:** ${phase}\n`;
  }
  
  response += `\n**Current Status:** Phase 3 implementation with advanced NEP features\n\n`;
  
  response += `**Key Highlights:**\n`;
  response += `✅ Multidisciplinary education with flexible credit system\n`;
  response += `✅ Multiple entry and exit options with proper certification\n`;
  response += `✅ Academic Bank of Credits (ABC) for credit storage and transfer\n`;
  response += `✅ Integration of vocational skills and internships\n`;
  response += `✅ Focus on holistic development and critical thinking\n\n`;
  
  response += `**NEP Cell Contact:**\n`;
  response += `👨‍🏫 Coordinator: ${nep.contact.coordinator}\n`;
  response += `📞 Phone: ${nep.contact.nep_cell}\n`;
  response += `📧 Email: ${nep.contact.email}\n`;
  response += `📍 Office: ${nep.contact.office}\n`;
  response += `⏰ Hours: ${nep.contact.hours}\n\n`;
  
  response += `💡 *Ask about specific NEP features like "credit system", "multidisciplinary options", or "entry-exit flexibility"*`;

  return response;
}

generateNEPFeatures() {
  const nep = collegeData.nep_implementation;
  
  let response = `**Key Features of NEP 2020 Implementation** 🌟\n\n`;
  
  nep.key_features.forEach((feature, index) => {
    response += `**${index + 1}. ${feature.title}**\n`;
    response += `${feature.description}\n`;
    
    if (feature.benefits) {
      response += `**Benefits:**\n`;
      feature.benefits.forEach(benefit => {
        response += `• ${benefit}\n`;
      });
    }
    
    if (feature.levels) {
      response += `**Academic Levels:**\n`;
      feature.levels.forEach(level => {
        response += `• **${level.level}** (${level.duration}) - ${level.credits}\n`;
      });
    }
    
    if (feature.features) {
      response += `**Features:**\n`;
      feature.features.forEach(feat => {
        response += `• ${feat}\n`;
      });
    }
    
    if (feature.components) {
      response += `**Components:**\n`;
      feature.components.forEach(component => {
        response += `• ${component}\n`;
      });
    }
    
    response += `\n`;
  });

  return response;
}

generateNEPCreditSystem() {
  const nep = collegeData.nep_implementation;
  
  let response = `**Credit System & Academic Bank of Credits (ABC)** 💳\n\n`;
  
  response += `**Credit Structure:**\n\n`;
  
  response += `**Undergraduate Programs:**\n`;
  for (const [program, credits] of Object.entries(nep.credit_structure.undergraduate)) {
    response += `• ${program}: ${credits}\n`;
  }
  
  response += `\n**Postgraduate Programs:**\n`;
  for (const [program, credits] of Object.entries(nep.credit_structure.postgraduate)) {
    response += `• ${program}: ${credits}\n`;
  }
  
  response += `\n**Academic Bank of Credits (ABC):**\n`;
  response += `• Digital repository for storing academic credits\n`;
  response += `• Enables credit transfer between institutions\n`;
  response += `• Supports multiple entry and exit options\n`;
  response += `• Facilitates lifelong learning\n`;
  response += `• Maintains complete academic history\n\n`;
  
  response += `**Credit Distribution:**\n`;
  response += `• Core Subjects: 50-60% of total credits\n`;
  response += `• Elective Subjects: 20-30% of total credits\n`;
  response += `• Skill Enhancement: 10-15% of total credits\n`;
  response += `• Internship/Project: 5-10% of total credits\n\n`;
  
  response += `**Benefits of Credit System:**\n`;
  response += `✅ Flexible learning pathways\n`;
  response += `✅ Inter-institution mobility\n`;
  response += `✅ Recognition of prior learning\n`;
  response += `✅ Multiple degree options\n`;
  response += `✅ Personalized learning experience\n\n`;
  
  response += `💡 *The credit system allows students to design their own learning journey with proper academic recognition.*`;

  return response;
}

generateNEPMultidisciplinary() {
  const nep = collegeData.nep_implementation;
  
  let response = `**Multidisciplinary Education under NEP 2020** 🔄\n\n`;
  
  response += `**Major Disciplines Available:**\n\n`;
  
  nep.major_disciplines.forEach(discipline => {
    response += `**${discipline.name}:**\n`;
    response += `• Departments: ${discipline.departments.join(', ')}\n`;
    response += `• Courses: ${discipline.courses.join(', ')}\n\n`;
  });
  
  response += `**Flexible Subject Combination:**\n`;
  response += `• Core Subjects (Major): Primary discipline of study\n`;
  response += `• Minor Stream: Secondary discipline (optional)\n`;
  response += `• Elective Subjects: From any department\n`;
  response += `• Skill Enhancement Courses: Vocational and life skills\n`;
  response += `• Value Added Courses: Additional certifications\n\n`;
  
  response += `**Example Combinations:**\n`;
  response += `• Computer Science Major with Commerce Minor\n`;
  response += `• Biotechnology Major with Management Electives\n`;
  response += `• Commerce Major with IT Skills Enhancement\n`;
  response += `• Arts Major with Digital Marketing Electives\n\n`;
  
  response += `**Benefits of Multidisciplinary Approach:**\n`;
  response += `✅ Broaden knowledge across domains\n`;
  response += `✅ Enhanced employability with diverse skills\n`;
  response += `✅ Flexibility to explore different interests\n`;
  response += `✅ Better preparation for complex real-world problems\n`;
  response += `✅ Opportunities for innovative career paths\n\n`;
  
  response += `💡 *Students can choose subjects across disciplines to create unique academic profiles that match their career aspirations.*`;

  return response;
}

generateNEPEntryExit() {
  const nep = collegeData.nep_implementation;
  
  let response = `**Multiple Entry & Exit Options under NEP 2020** 🚪\n\n`;
  
  const entryExit = nep.key_features.find(feature => feature.title === "Multiple Entry/Exit Options");
  
  if (entryExit && entryExit.levels) {
    response += `**Academic Pathway Options:**\n\n`;
    
    entryExit.levels.forEach(level => {
      response += `**${level.level}**\n`;
      response += `• Duration: ${level.duration}\n`;
      response += `• Credits Required: ${level.credits}\n`;
      response += `• Eligibility: ${level.eligibility}\n`;
      response += `• Certification: ${level.level} in chosen discipline\n\n`;
    });
  }
  
  response += `**Pathway Examples:**\n`;
  response += `**Pathway 1:** Complete 1 year → Get Certificate → Exit\n`;
  response += `**Pathway 2:** Complete 2 years → Get Diploma → Exit or Continue\n`;
  response += `**Pathway 3:** Complete 3 years → Get Bachelor's Degree → Exit or Continue\n`;
  response += `**Pathway 4:** Complete 4 years → Get Bachelor's Degree (Honors/Honors with Research)\n\n`;
  
  response += `**Re-entry Options:**\n`;
  response += `• Rejoin within 3 years of exit\n`;
  response += `• Credit transfer through ABC\n`;
  response += `• Continue from where you left\n`;
  response += `• No loss of academic progress\n\n`;
  
  response += `**Benefits of Multiple Entry-Exit:**\n`;
  response += `✅ No academic loss if you need to take a break\n`;
  response += `✅ Proper certification at each exit point\n`;
  response += `✅ Flexibility to work and study simultaneously\n`;
  response += `✅ Opportunity to gain work experience and return\n`;
  response += `✅ Financial flexibility in education planning\n\n`;
  
  response += `💡 *This system ensures that students receive proper recognition for their academic progress, even if they need to pause their studies.*`;

  return response;
}

generateNEPImplementation() {
  const nep = collegeData.nep_implementation;
  
  let response = `**NEP 2020 Implementation at RJ College** 🏫\n\n`;
  
  response += `**Implementation Timeline:**\n`;
  for (const [year, phase] of Object.entries(nep.implementation_timeline)) {
    response += `• **${year}:** ${phase}\n`;
  }
  
  response += `\n**Current Phase (2024-25):**\n`;
  response += `✅ Full credit system implementation\n`;
  response += `✅ Multidisciplinary course options\n`;
  response += `✅ Academic Bank of Credits operational\n`;
  response += `✅ Skill enhancement integration\n`;
  response += `✅ Digital learning infrastructure\n\n`;
  
  response += `**Infrastructure Upgrades:**\n`;
  response += `• Digital classrooms and smart boards\n`;
  response += `• Enhanced library with digital resources\n`;
  response += `• Computer labs with latest software\n`;
  response += `• Online learning management system\n`;
  response += `• Virtual classroom facilities\n\n`;
  
  response += `**Faculty Development:**\n`;
  response += `• Regular NEP training programs\n`;
  response += `• Workshops on multidisciplinary teaching\n`;
  response += `• Digital pedagogy training\n`;
  response += `• Research methodology workshops\n`;
  response += `• Industry-academia interaction programs\n\n`;
  
  response += `**Student Support Systems:**\n`;
  response += `• Academic counseling for course selection\n`;
  response += `• Credit transfer assistance\n`;
  response += `• Career guidance under new framework\n`;
  response += `• Digital literacy programs\n`;
  response += `• Internship and placement support\n\n`;
  
  response += `**NEP Implementation Cell:**\n`;
  response += `👨‍🏫 Coordinator: ${nep.contact.coordinator}\n`;
  response += `📞 Phone: ${nep.contact.nep_cell}\n`;
  response += `📧 Email: ${nep.contact.email}\n`;
  response += `📍 Office: ${nep.contact.office}\n`;
  response += `⏰ Hours: ${nep.contact.hours}\n\n`;
  
  response += `💡 *RJ College is committed to successful NEP implementation to provide world-class education with Indian values and global relevance.*`;

  return response;
}

generateNEPBenefits() {
  const nep = collegeData.nep_implementation;
  
  let response = `**Benefits of NEP 2020 for Students** 🌈\n\n`;
  
  response += `**Academic Benefits:**\n`;
  nep.student_benefits.forEach((benefit, index) => {
    response += `✅ ${benefit}\n`;
  });
  
  response += `\n**Career Advantages:**\n`;
  response += `🚀 Enhanced employability with diverse skills\n`;
  response += `🚀 Better preparation for industry requirements\n`;
  response += `🚀 Opportunities for entrepreneurship\n`;
  response += `🚀 Global mobility through credit transfer\n`;
  response += `🚀 Lifelong learning opportunities\n\n`;
  
  response += `**Personal Development:**\n`;
  response += `🌟 Holistic development with focus on values\n`;
  response += `🌟 Critical thinking and problem-solving skills\n`;
  response += `🌟 Creativity and innovation enhancement\n`;
  response += `🌟 Leadership and teamwork abilities\n`;
  response += `🌟 Digital literacy and technological skills\n\n`;
  
  response += `**Financial Benefits:**\n`;
  response += `💰 Multiple exit points with proper certification\n`;
  response += `💰 Opportunity to work and study simultaneously\n`;
  response += `💰 No financial loss due to academic breaks\n`;
  response += `💰 Better ROI on education investment\n`;
  response += `💰 Scholarship opportunities based on credits\n\n`;
  
  response += `**Societal Impact:**\n`;
  response += `🌍 Creates globally competitive graduates\n`;
  response += `🌍 Promotes Indian knowledge traditions\n`;
  response += `🌍 Fosters research and innovation culture\n`;
  response += `🌍 Supports sustainable development goals\n`;
  response += `🌍 Builds future-ready citizens\n\n`;
  
  response += `💡 *NEP 2020 transforms education from degree-focused to learning-focused, empowering students to become lifelong learners and responsible global citizens.*`;

  return response;
}




  // ========== GENERAL COLLEGE INFO METHODS ==========

  generateAchievementsInfo() {
    const achievements = collegeData.achievements;
    
    let response = `**College Achievements & Accreditations** 🏆\n\n`;
    
    // Group by category
    const categories = {};
    achievements.forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = [];
      }
      categories[achievement.category].push(achievement);
    });
    
    for (const [category, categoryAchievements] of Object.entries(categories)) {
      response += `**${category}:**\n`;
      categoryAchievements.forEach(achievement => {
        response += `• **${achievement.title}** (${achievement.year})\n`;
        response += `  ${achievement.description}\n`;
      });
      response += `\n`;
    }

    response += `*RJ College continues to achieve excellence in education, research, and student development.*`;

    return response;
  }

  generateAboutCollege() {
    const info = collegeData.college_info;
    
    let response = `**About Ramniranjan Jhunjhunwala College** 🏛️\n\n`;
    
    response += `**Established:** ${info.established}\n`;
    response += `**Location:** ${info.location}\n`;
    response += `**Type:** ${info.type}\n`;
    response += `**Affiliation:** ${info.affiliation}\n`;
    response += `**Campus Size:** ${info.campus_size}\n`;
    response += `**Motto:** "${info.motto}"\n\n`;
    
    response += `**Vision:** ${info.vision}\n\n`;
    response += `**Mission:** ${info.mission}\n\n`;
    
    response += `**Infrastructure:**\n`;
    response += `• Student Strength: ${info.student_strength}\n`;
    response += `• Faculty Count: ${info.faculty_count}\n`;
    response += `• Administrative Staff: ${info.administrative_staff}\n`;
    response += `• Library Books: ${info.library_books}\n`;
    response += `• Laboratories: ${info.laboratories}\n`;
    response += `• Classrooms: ${info.classrooms}\n\n`;
    
    response += `RJ College is a premier educational institution in Mumbai offering quality education across multiple disciplines with modern infrastructure, experienced faculty, and excellent placement opportunities.`;

    return response;
  }

  generateEventsInfo() {
    const events = collegeData.events;
    
    let response = `**College Events & Activities** 🎉\n\n`;
    
    response += `**Academic & Technical Events:**\n`;
    events.academic.forEach(event => {
      response += `• **${event.name}** - ${event.month}\n`;
      response += `  ${event.description}\n`;
      response += `  Duration: ${event.duration}\n`;
      response += `  Highlights: ${event.highlights.join(', ')}\n\n`;
    });
    
    response += `**Sports Events:**\n`;
    events.sports.forEach(event => {
      response += `• **${event.name}** - ${event.month}\n`;
      response += `  ${event.description}\n`;
      response += `  Duration: ${event.duration}\n`;
      response += `  Highlights: ${event.highlights.join(', ')}\n\n`;
    });
    
    response += `**Cultural Events:**\n`;
    events.cultural.forEach(event => {
      response += `• **${event.name}** - ${event.month}\n`;
      response += `  ${event.description}\n`;
      response += `  Duration: ${event.duration}\n`;
      response += `  Highlights: ${event.highlights.join(', ')}\n\n`;
    });
    
    response += `**Other Activities:**\n`;
    response += `• Workshops and Seminars (Throughout the year)\n`;
    response += `• Industry Visits and Guest Lectures\n`;
    response += `• Social Outreach Programs\n`;
    response += `• Cultural and Literary Activities\n\n`;
    
    response += `💡 *Event dates are announced on college notice boards and website. Students are encouraged to participate actively.*`;

    return response;
  }

  generateStudentSupportInfo() {
    const support = collegeData.student_support;
    
    let response = `**Student Support Services** 🤝\n\n`;
    
    response += `**Counseling Services:**\n`;
    response += `• Available: ${support.counseling.available ? 'Yes' : 'No'}\n`;
    response += `• Services: ${support.counseling.services.join(', ')}\n`;
    response += `• Timing: ${support.counseling.timing}\n`;
    response += `• Contact: ${support.counseling.contact}\n\n`;
    
    response += `**NCC (National Cadet Corps):**\n`;
    response += `• Available: ${support.ncc.available ? 'Yes' : 'No'}\n`;
    response += `• Units: ${support.ncc.units.join(', ')}\n`;
    response += `• Activities: ${support.ncc.activities.join(', ')}\n`;
    response += `• Contact: ${support.ncc.contact}\n\n`;
    
    response += `**NSS (National Service Scheme):**\n`;
    response += `• Available: ${support.nss.available ? 'Yes' : 'No'}\n`;
    response += `• Activities: ${support.nss.activities.join(', ')}\n`;
    response += `• Contact: ${support.nss.contact}\n\n`;
    
    response += `**Student Clubs:**\n`;
    response += `• Available: ${support.clubs.available ? 'Yes' : 'No'}\n`;
    response += `• Clubs: ${support.clubs.list.join(', ')}\n\n`;
    
    response += `**Additional Support:**\n`;
    response += `• Career guidance and placement training\n`;
    response += `• Health and wellness programs\n`;
    response += `• Legal aid and counseling\n`;
    response += `• Grievance redressal system\n`;
    response += `• Alumni network and mentorship\n\n`;
    
    response += `💡 *The college provides comprehensive support to ensure overall development and well-being of every student.*`;

    return response;
  }

  // ========== GENERAL RESPONSE METHODS ==========

  generateGreetingResponse() {
  return `Hello! 👋 Welcome to RJ College Assistant! \n\nI'm here to help you with comprehensive information about Ramniranjan Jhunjhunwala College. I can assist you with:\n\n
👨‍🏫 **College Leadership**
• Principal, President, Vice Principal information
• Department heads and faculty details

📞 **Contact Information**  
• Phone numbers and email addresses
• College location and address
• Office hours and departments

🎓 **Academic Information**
• All departments, courses, and programs
• Admission process for 2025-26
• Fee structures and eligibility

💰 **Financial Information**
• Detailed fee breakdowns
• Scholarships and financial aid
• Payment procedures

🏢 **Placements & Careers**
• Placement statistics and records
• Top recruiting companies
• Internship opportunities

🏫 **College Facilities**
• Library, labs, sports complex
• Hostel facilities and amenities
• Infrastructure details

📊 **General Information**
• College achievements and awards
• Events and activities
• Student support services

📚 **NEP 2020 Information**
• New Education Policy implementation
• Credit system and multidisciplinary options
• Multiple entry-exit flexibility
• Academic Bank of Credits\n\n
What would you like to know about Ramniranjan Jhunjhunwala College?`;

  }

  generateThanksResponse() {
    return `You're welcome! 😊 \n\nI'm glad I could help you with information about RJ College. If you have any more questions about:\n\n• Courses and programs\n• Admission process\n• Contact information\n• Fee structure\n• Placement opportunities\n• College facilities\n\nFeel free to ask! I'm here to provide you with all the information you need.\n\nHave a great day! 🌟`;
  }

  generateHelpResponse() {
    return `I'm the RJ College Assistant! 🤖 Here's what I can help you with:\n\n
**👨‍🏫 Leadership & Contact**\n• "Who is the principal?"\n• "College contact details"\n• "President information"\n• "Phone numbers and email"\n\n**🎓 Academic Information**\n• "List all departments"\n• "Courses in Computer Science"\n• "Admission process"\n• "Fee structure for B.Sc IT"\n\n**💰 Financial Matters**\n• "Scholarships available"\n• "Course fees breakdown"\n• "Financial aid options"\n\n**🏢 Placements & Facilities**\n• "Placement statistics"\n• "Top recruiting companies"\n• "College facilities"\n• "Hostel information"\n\n**📊 General Information**\n• "College achievements"\n• "Events and activities"\n• "Student support services"\n\nJust ask me anything about Ramniranjan Jhunjhunwala College, and I'll provide you with detailed information!`;
  }

  getClarificationResponse(analysis) {
    const suggestions = this.nlpProcessor.getSuggestedQuestions(analysis.intent);
    
    let response = `I want to make sure I understand correctly. Are you asking about:\n\n`;
    
    suggestions.slice(0, 3).forEach((suggestion, index) => {
      response += `${index + 1}. ${suggestion}\n`;
    });
    
    response += `\nOr please rephrase your question for more specific information.`;
    
    return response;
  }

  getFallbackResponse() {
    return `I apologize, but I'm having trouble understanding your question. I can help you with comprehensive information about:\n\n
👨‍🏫 **College Leadership & Contact**\n• Principal, President, Vice Principal details\n• Complete contact information\n• Phone numbers and email addresses\n• College location and address\n\n🎓 **Academic Programs**\n• All departments and courses\n• Undergraduate and postgraduate programs\n• Admission process for 2025-26\n• Eligibility criteria and requirements\n\n💰 **Financial Information**\n• Complete fee structures\n• Scholarship opportunities\n• Payment procedures\n• Financial aid options\n\n🏢 **Placements & Careers**\n• Placement statistics\n• Top recruiting companies\n• Internship opportunities\n• Career guidance\n\n🏫 **College Facilities**\n• Library and laboratories\n• Sports complex and hostels\n• Infrastructure details\n• Student amenities\n\nPlease try asking your question in a different way, or type "help" to see everything I can assist with.`;
  }

  generateGeneralResponse(analysis) {
    return `Thanks for your question! I understand you're asking about "${analysis.originalQuestion}".\n\n
I can provide detailed information about Ramniranjan Jhunjhunwala College including:\n\n
👨‍🏫 **College Leadership & Contact**\n• Principal, President, Vice Principal details\n• Complete contact information\n• Phone numbers and email addresses\n\n🎓 **Academic Programs**\n• All departments and courses\n• Undergraduate and postgraduate programs\n• Admission process for 2025-26\n• Eligibility criteria and requirements\n\n💰 **Financial Information**\n• Complete fee structures\n• Scholarship opportunities\n• Financial aid options\n\n🏢 **Placements & Facilities**\n• Placement statistics\n• Top recruiting companies\n• College facilities and infrastructure\n\nCould you please be more specific about what you'd like to know? For example:\n• "Who is the principal?"\n• "College contact details"\n• "Courses in Computer Science"\n• "Fee structure for B.Sc IT"\n• "Placement statistics for IT department"\n• "Scholarships available"`;
  }
}




module.exports = ResponseGenerator;