// backend/utils/questionUnderstanding.js
class QuestionUnderstanding {
  constructor() {
    // Define question patterns for better understanding
    this.patterns = {
      departments: [
        // Exact matches
        'departments',
        'faculties',
        'schools',
        'branches',
        'streams',
        
        // Question patterns
        'which departments',
        'what departments', 
        'list departments',
        'available departments',
        'how many departments',
        'name of departments',
        'tell me departments',
        'show departments',
        'departments available',
        'departments offered',
        'departments in college',
        'college departments',
        'academic departments',
        'study departments',
        
        // Variations
        'what are the departments',
        'which are the departments',
        'what all departments',
        'which all departments',
        'what kind of departments',
        'what type of departments',
        
        // Short forms
        'dept',
        'depts'
      ],
      
      courses: [
        'courses',
        'programs',
        'degrees',
        'studies',
        'which courses',
        'what courses',
        'available courses',
        'list of courses',
        'courses offered',
        'what programs',
        'which programs',
        'degree programs',
        'study programs'
      ],
      
      principal: [
        'principal',
        'director',
        'head of college',
        'college head',
        'who is principal',
        'name of principal',
        'current principal',
        'college principal',
        'who runs college',
        'college leader'
      ],
      
      president: [
        'president',
        'chairman',
        'governing body',
        'board president',
        'trust president',
        'who is president',
        'college president',
        'institution president'
      ],
      
      admissions: [
        'admission',
        'admissions',
        'apply',
        'application',
        'how to apply',
        'admission process',
        'get admission',
        'join college',
        'enrollment',
        'registration'
      ],
      
      contact: [
        'contact',
        'address',
        'location',
        'where is',
        'phone',
        'email',
        'reach college',
        'college location',
        'visit college'
      ]
    };
  }

  understandQuestion(question) {
    const q = question.toLowerCase().trim();
    
    // Remove common filler words for better matching
    const cleanQ = q.replace(/\b(the|a|an|is|are|can|you|me|please|tell|give|show|list)\b/g, '').trim();
    
    console.log(`🔍 Processing: "${q}" -> Cleaned: "${cleanQ}"`);
    
    // Check each category with multiple patterns
    for (const [category, patterns] of Object.entries(this.patterns)) {
      if (this.matchesPattern(cleanQ, patterns) || this.matchesPattern(q, patterns)) {
        console.log(`✅ Matched: ${category}`);
        return category;
      }
    }
    
    // Special cases for department queries that might not match directly
    if (this.isDepartmentQuery(q)) {
      console.log(`✅ Detected as department query`);
      return 'departments';
    }
    
    console.log(`❓ No specific match, using general`);
    return 'general';
  }

  matchesPattern(question, patterns) {
    return patterns.some(pattern => {
      // Exact word match
      if (question === pattern) return true;
      
      // Contains the pattern as a word
      if (question.includes(pattern) && pattern.length > 3) return true;
      
      // For shorter patterns, check word boundaries
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      return regex.test(question);
    });
  }

  isDepartmentQuery(question) {
    const q = question.toLowerCase();
    
    // Common department-related question patterns
    const departmentIndicators = [
      // Question words about departments
      /(what|which|how many|name).*(department|faculty|branch|stream)/,
      /(department|faculty).*(available|there|have|offer)/,
      /(available|there).*(department|faculty)/,
      /(college|institute).*(department|faculty)/,
      
      // Direct queries about specific aspects
      /^\s*(departments?|faculties?|branches?|streams?)\s*$/,
      /^\s*(what|which)\s+(are|is)\s+(the\s+)?(departments?|faculties?)/,
      /^\s*(list|name|show)\s+(the\s+)?(departments?|faculties?)/,
      /^\s*(how\s+many)\s+(departments?|faculties?)/,
      
      // Conversational queries
      /(can you|please)\s+(tell|show|list).*(department|faculty)/,
      /(i want|i need).*(department|faculty).*(information|list|details)/
    ];
    
    return departmentIndicators.some(indicator => indicator.test(q));
  }

  // Get suggested questions for better user experience
  getSuggestedQuestions(category) {
    const suggestions = {
      departments: [
        "Which departments are available?",
        "List all academic departments",
        "How many departments does the college have?",
        "What are the different faculties?"
      ],
      courses: [
        "What courses are offered?",
        "List all degree programs", 
        "What undergraduate courses are available?",
        "What postgraduate programs are there?"
      ],
      principal: [
        "Who is the principal?",
        "Tell me about the college principal",
        "Who heads the college?"
      ],
      admissions: [
        "How to apply for admission?",
        "What is the admission process?",
        "When does admission start?"
      ],
      general: [
        "Tell me about the college",
        "What are the college achievements?",
        "College contact information"
      ]
    };
    
    return suggestions[category] || suggestions.general;
  }
}

module.exports = QuestionUnderstanding;