// backend/utils/nlpProcessor.js
class NLPProcessor {
  constructor() {
    this.intents = {
      // Department-related intents
      DEPARTMENT_LIST: 'department_list',
      DEPARTMENT_DETAILS: 'department_details',
      DEPARTMENT_COURSES: 'department_courses',
      DEPARTMENT_HEAD: 'department_head',
      DEPARTMENT_FACILITIES: 'department_facilities',
      
      // Course-related intents
      COURSE_LIST: 'course_list',
      COURSE_DETAILS: 'course_details',
      COURSE_ELIGIBILITY: 'course_eligibility',
      COURSE_FEES: 'course_fees',
      COURSE_SYLLABUS: 'course_syllabus',
      COURSE_CAREER: 'course_career',
      
      // Admission-related intents
      ADMISSION_PROCESS: 'admission_process',
      ADMISSION_DATES: 'admission_dates',
      ADMISSION_ELIGIBILITY: 'admission_eligibility',
      ADMISSION_CONTACT: 'admission_contact',
      ADMISSION_FEES: 'admission_fees',
      ADMISSION_DOCUMENTS: 'admission_documents',
      
      // Placement-related intents
      PLACEMENT_STATS: 'placement_stats',
      PLACEMENT_COMPANIES: 'placement_companies',
      PLACEMENT_PROCESS: 'placement_process',
      PLACEMENT_CONTACT: 'placement_contact',
      PLACEMENT_TRAINING: 'placement_training',
      
      // Faculty & Leadership intents
      PRINCIPAL_INFO: 'principal_info',
      PRESIDENT_INFO: 'president_info',
      VICE_PRINCIPAL_INFO: 'vice_principal_info',
      FACULTY_INFO: 'faculty_info',
      DEPARTMENT_HEAD_INFO: 'department_head_info',
      
      // Contact & Location intents
      CONTACT_INFO: 'contact_info',
      LOCATION_INFO: 'location_info',
      ADDRESS_INFO: 'address_info',
      PHONE_INFO: 'phone_info',
      EMAIL_INFO: 'email_info',
      
      // Financial intents
      FEE_STRUCTURE: 'fee_structure',
      SCHOLARSHIPS: 'scholarships',
      FINANCIAL_AID: 'financial_aid',
      
      // Facility intents
      FACILITIES: 'facilities',
      INFRASTRUCTURE: 'infrastructure',
      LIBRARY_INFO: 'library_info',
      HOSTEL_INFO: 'hostel_info',
      SPORTS_INFO: 'sports_info',
      
      // General intents
      ACHIEVEMENTS: 'achievements',
      ABOUT_COLLEGE: 'about_college',
      EVENTS: 'events',
      STUDENT_SUPPORT: 'student_support',
      GREETING: 'greeting',
      HELP: 'help',
      THANKS: 'thanks',
      UNKNOWN: 'unknown',

      // Add these to the intents object
      NEP_OVERVIEW: 'nep_overview',
      NEP_FEATURES: 'nep_features', 
      NEP_CREDIT_SYSTEM: 'nep_credit_system',
      NEP_MULTIDISCIPLINARY: 'nep_multidisciplinary',
      NEP_ENTRY_EXIT: 'nep_entry_exit',
      NEP_IMPLEMENTATION: 'nep_implementation',
      NEP_BENEFITS: 'nep_benefits',


    };

    this.patterns = {
      // Enhanced patterns with better coverage
      [this.intents.DEPARTMENT_LIST]: [
        /(list|show|what are|which|name).*(department|faculty|branch|stream)/i,
        /(department|faculty).*(available|there|have|offer)/i,
        /^(departments?|faculties?|branches?|streams?)$/i,
        /(how many).*(department|faculty)/i,
        /(tell me about).*(all|the).*(department|faculty)/i
      ],
      
      [this.intents.DEPARTMENT_DETAILS]: [
        /(tell me about|information about|details of).*(department|faculty)/i,
        /(it|computer science|biotechnology|management|arts|science|commerce).*(department)/i,
        /(department of).*(it|computer|biotech|management|arts|science|commerce)/i
      ],
      
      [this.intents.DEPARTMENT_HEAD]: [
        /(head of|who heads|chairperson of).*(department|faculty)/i,
        /(department head|hod|head of department)/i,
        /(who is).*(it|computer|biotech|management|arts|science|commerce).*(head)/i
      ],
      
      // Enhanced Principal patterns
      [this.intents.PRINCIPAL_INFO]: [
        /(principal|director|head).*(college|institute)/i,
        /(who is).*(principal|director)/i,
        /^(principal|director)$/i,
        /(name of principal|current principal|college principal)/i,
        /(tell me about principal|information about principal)/i,
        /(principal.*name|director.*name)/i,
        /(who runs the college|who leads the college)/i
      ],
      
      // President patterns
      [this.intents.PRESIDENT_INFO]: [
        /(president|chairman|governing body)/i,
        /(who is).*(president|chairman)/i,
        /^(president|chairman)$/i,
        /(name of president|current president)/i,
        /(tell me about president|information about president)/i,
        /(president.*name|chairman.*name)/i,
        /(governing council|board president)/i
      ],
      
      // Vice Principal patterns
      [this.intents.VICE_PRINCIPAL_INFO]: [
        /(vice principal|deputy principal)/i,
        /(who is).*(vice principal)/i,
        /(vice principal.*name|deputy principal.*name)/i,
        /(tell me about vice principal)/i
      ],
      
      // Enhanced Contact patterns
      [this.intents.CONTACT_INFO]: [
        /(contact|address|location|phone|email)/i,
        /(where is|how to reach).*(college)/i,
        /(college contact|phone number|email address)/i,
        /(get in touch|reach us|contact details)/i,
        /(college address|location address)/i,
        /(phone|mobile|telephone).*(number)/i,
        /(email|e-mail).*(address)/i,
        /(give me contact|provide contact|share contact)/i
      ],
      
      [this.intents.LOCATION_INFO]: [
        /(where is|location of|address of).*(college)/i,
        /(how to come|how to reach|directions to)/i,
        /(college location|college address)/i,
        /(landmark|nearby|railway station|metro)/i
      ],
      
      [this.intents.PHONE_INFO]: [
        /(phone number|telephone number|contact number)/i,
        /(call|phone|telephone).*(college)/i,
        /(what is the phone number|college phone)/i,
        /(contact.*phone|number.*phone)/i
      ],
      
      [this.intents.EMAIL_INFO]: [
        /(email|e-mail).*(address)/i,
        /(college email|email id|e-mail id)/i,
        /(send email|mail to|contact via email)/i,
        /(what is the email|email address of)/i
      ],
      
      [this.intents.COURSE_FEES]: [
        /(fees?|cost|price).*(course|program|degree)/i,
        /(how much|what is the fee|fee structure)/i,
        /(course|program).*(fees?|cost)/i,
        /(total fee|total cost).*(course|program)/i
      ],
      
      [this.intents.PLACEMENT_STATS]: [
        /(placement|placement statistics|placement record)/i,
        /(how many students placed|placement percentage)/i,
        /(highest package|average package|salary)/i,
        /(placement data|placement information)/i
      ],
      
      [this.intents.PLACEMENT_COMPANIES]: [
        /(placement companies|recruiters|hiring companies)/i,
        /(which companies|top companies|recruiting)/i,
        /(companies that visit|companies coming)/i
      ],
      
      [this.intents.FEE_STRUCTURE]: [
        /(fee structure|fees details|tuition fees)/i,
        /(how much fee|course fees|program fees)/i,
        /(fee breakdown|fee details)/i
      ],
      
      [this.intents.SCHOLARSHIPS]: [
        /(scholarship|financial aid|fee waiver)/i,
        /(free education|financial assistance)/i,
        /(scholarship options|available scholarships)/i
      ],
      
      [this.intents.FACILITIES]: [
        /(facilit(y|ies)|infrastructure|amenities)/i,
        /(library|lab|laboratory|sports|hostel)/i,
        /(college facilities|available facilities)/i
      ],
      
      [this.intents.LIBRARY_INFO]: [
        /(library|books|reading room)/i,
        /(college library|central library)/i,
        /(library facilities|library timing)/i
      ],
      
      [this.intents.HOSTEL_INFO]: [
        /(hostel|accommodation|boarding)/i,
        /(college hostel|student hostel)/i,
        /(hostel facilities|hostel fees)/i
      ],
      
      [this.intents.SPORTS_INFO]: [
        /(sports|games|athletics)/i,
        /(sports facilities|playground|gym)/i,
        /(sports complex|indoor games)/i
      ],
      
      [this.intents.ACHIEVEMENTS]: [
        /(achievement|award|recognition|accreditation)/i,
        /(naac|nba|ranking|a grade)/i,
        /(college achievements|awards won)/i
      ],
      
      [this.intents.EVENTS]: [
        /(events?|fest|festival|activities)/i,
        /(cultural|technical|sports).*(event)/i,
        /(college events|upcoming events)/i
      ],

      [this.intents.STUDENT_SUPPORT]: [
        /(student support|student services)/i,
        /(counseling|ncc|nss|clubs)/i,
        /(student activities|extra curricular)/i
      ],

      // Enhanced course patterns
      [this.intents.COURSE_LIST]: [
        /^(courses?|programs?|degrees?|studies)$/i,
        /(what|which).*(courses?|programs?)/i,
        /(list|show).*(courses?|programs?)/i,
        /(available|offered).*(courses?|programs?)/i,
        /(tell me about).*(courses?|programs?)/i,
        /(what are the).*(courses?|programs?)/i,
        /(which all).*(courses?|programs?)/i,
        /(what kind of).*(courses?|programs?)/i,
        /(available).*(study options)/i,
        /(what can i study)/i,
        /(study options)/i,
        /(academic programs)/i,
        /(all programs)/i
      ],
      
      [this.intents.COURSE_DETAILS]: [
        /(details|information|about).*(b\.sc|m\.sc|b\.com|m\.com|bba|bms)/i,
        /(duration|fees|seats).*(course|program)/i,
        /(tell me about).*(b\.sc|m\.sc|b\.com|m\.com|bba|bms)/i
      ],
      
      [this.intents.COURSE_ELIGIBILITY]: [
        /(eligibility|qualification|requirements).*(course|program)/i,
        /(what are the requirements|eligibility criteria)/i,
        /(minimum marks|qualification needed)/i
      ],
      
      [this.intents.COURSE_SYLLABUS]: [
        /(syllabus|subjects|curriculum)/i,
        /(what will i study|course content)/i,
        /(subjects covered|topics included)/i
      ],
      
      [this.intents.COURSE_CAREER]: [
        /(career|job|opportunities|scope)/i,
        /(what after|future prospects)/i,
        /(job opportunities|career options)/i
      ],
      
      [this.intents.ADMISSION_PROCESS]: [
        /(how to apply|admission process|procedure)/i,
        /(apply|admission).*(process|procedure)/i,
        /(steps for admission|admission steps)/i
      ],
      
      [this.intents.ADMISSION_DATES]: [
        /(admission dates|when|dates|schedule)/i,
        /(start|end).*(admission|application)/i,
        /(important dates|admission schedule)/i
      ],
      
      [this.intents.ADMISSION_DOCUMENTS]: [
        /(documents|papers|certificates)/i,
        /(required documents|documents needed)/i,
        /(what documents|papers required)/i
      ],
      
      [this.intents.GREETING]: [
        /^(hello|hi|hey|good morning|good afternoon|good evening)/i,
        /(how are you)/i,
        /^(hey|hi|hello)$/i
      ],
      
      [this.intents.THANKS]: [
        /(thank|thanks|thank you)/i,
        /(thanks a lot|thank you very much)/i
      ],
      
      [this.intents.HELP]: [
        /(help|what can you do|support)/i,
        /(how can you help|assist me)/i
      ],
      
      [this.intents.ABOUT_COLLEGE]: [
        /(about|tell me about).*(college)/i,
        /(history|established|information).*(college)/i,
        /(college information|about rj college)/i,
        /(what is r,j college|about this college)/i
      ],
      // Add these to the patterns object
[this.intents.NEP_OVERVIEW]: [
  /(nep|national education policy|new education policy)/i,
  /(what is nep|about nep|nep policy)/i,
  /(education policy|new policy)/i,
  /(nep 2020|national policy)/i,
  /(what.*nep|tell me.*nep)/i
],

[this.intents.NEP_FEATURES]: [
  /(features of nep|nep features|key features.*nep)/i,
  /(what are.*features.*nep)/i,
  /(nep.*components|components.*nep)/i
],

[this.intents.NEP_CREDIT_SYSTEM]: [
  /(credit system|academic bank|abc)/i,
  /(credits.*nep|nep.*credits)/i,
  /(credit transfer|bank of credits)/i
],

[this.intents.NEP_MULTIDISCIPLINARY]: [
  /(multidisciplinary|interdisciplinary)/i,
  /(choice of subjects|elective subjects)/i,
  /(minor.*major|multiple disciplines)/i
],

[this.intents.NEP_ENTRY_EXIT]: [
  /(entry exit|multiple entry)/i,
  /(exit options|certificate.*diploma)/i,
  /(flexible.*degree)/i
],

[this.intents.NEP_IMPLEMENTATION]: [
  /(nep implementation|implement.*nep)/i,
  /(how.*implement.*nep|nep.*college)/i,
  /(nep.*timeline)/i
],

[this.intents.NEP_BENEFITS]: [
  /(benefits.*nep|nep.*benefits)/i,
  /(advantages.*nep)/i,
  /(why nep|importance.*nep)/i
],
    };

    this.departmentKeywords = {
      'it': 'Information Technology',
      'information technology': 'Information Technology',
      'computer': 'Computer Science', 
      'cs': 'Computer Science',
      'computer science': 'Computer Science',
      'biotech': 'Biotechnology',
      'biotechnology': 'Biotechnology',
      'management': 'Management Studies',
      'bms': 'Management Studies',
      'bba': 'Management Studies',
      'arts': 'Arts',
      'science': 'Science',
      'commerce': 'Commerce'
    };

    this.courseKeywords = {
      'b.sc it': 'B.Sc. Information Technology',
      'b.sc computer science': 'B.Sc. Computer Science',
      'b.sc computer': 'B.Sc. Computer Science',
      'b.sc biotech': 'B.Sc. Biotechnology',
      'b.sc biotechnology': 'B.Sc. Biotechnology',
      'm.sc it': 'M.Sc. Information Technology',
      'm.sc computer science': 'M.Sc. Computer Science',
      'm.sc biotechnology': 'M.Sc. Biotechnology',
      'b.com': 'B.Com',
      'm.com': 'M.Com',
      'bba': 'BBA',
      'bms': 'BMS',
      'b.a': 'B.A',
      'm.a': 'M.A',
      'b.sc': 'B.Sc',
      'm.sc': 'M.Sc',
      'undergraduate': 'undergraduate',
      'postgraduate': 'postgraduate',
      'graduate': 'postgraduate',
      'phd': 'PhD',
      'diploma': 'Diploma'
    };
  }

  extractIntent(question) {
    const q = question.toLowerCase().trim();
    
    // Check for greeting first
    if (this.isGreeting(q)) {
      return this.intents.GREETING;
    }
    
    // Check for thanks
    if (this.isThanks(q)) {
      return this.intents.THANKS;
    }
    
    // Check for help
    if (this.isHelp(q)) {
      return this.intents.HELP;
    }
    
    // Check for course-related patterns
    if (this.isCourseQuery(q)) {
      return this.intents.COURSE_LIST;
    }
    
    // Then check other patterns with priority for leadership and contact
    const priorityIntents = [
      this.intents.PRINCIPAL_INFO,
      this.intents.PRESIDENT_INFO,
      this.intents.VICE_PRINCIPAL_INFO,
      this.intents.CONTACT_INFO,
      this.intents.LOCATION_INFO,
      this.intents.PHONE_INFO,
      this.intents.EMAIL_INFO
    ];
    
    for (const intent of priorityIntents) {
      if (this.patterns[intent]?.some(pattern => pattern.test(q))) {
        return intent;
      }
    }
    
    // Check remaining patterns
    for (const [intent, patterns] of Object.entries(this.patterns)) {
      if (priorityIntents.includes(intent)) continue; // Skip already checked
      
      for (const pattern of patterns) {
        if (pattern.test(q)) {
          return intent;
        }
      }
    }
    
    return this.intents.UNKNOWN;
  }

  isCourseQuery(question) {
    const courseIndicators = [
      /^(courses?|programs?|degrees?|studies)$/i,
      /(what|which).*(courses?|programs?)/i,
      /(list|show).*(courses?|programs?)/i,
      /(available|offered).*(courses?|programs?)/i,
      /(study options)/i,
      /(what can i study)/i,
      /(academic programs)/i,
      /(all programs)/i
    ];
    
    return courseIndicators.some(indicator => indicator.test(question));
  }

  isGreeting(question) {
    const greetingIndicators = [
      /^(hello|hi|hey|good morning|good afternoon|good evening)/i,
      /(how are you)/i,
      /^(hey|hi|hello)$/i
    ];
    return greetingIndicators.some(indicator => indicator.test(question));
  }

  isThanks(question) {
    const thanksIndicators = [
      /(thank|thanks|thank you)/i,
      /(thanks a lot|thank you very much)/i
    ];
    return thanksIndicators.some(indicator => indicator.test(question));
  }

  isHelp(question) {
    const helpIndicators = [
      /(help|what can you do|support)/i,
      /(how can you help|assist me)/i
    ];
    return helpIndicators.some(indicator => indicator.test(question));
  }

  processQuestion(question) {
    const q = question.toLowerCase().trim();
    
    // Extract intent
    const intent = this.extractIntent(q);
    
    // Extract entities
    const entities = this.extractEntities(q);
    
    // Extract department if mentioned
    const department = this.extractDepartment(q);
    
    // Extract course if mentioned
    const course = this.extractCourse(q);
    
    return {
      intent,
      entities,
      department,
      course,
      originalQuestion: question,
      confidence: this.calculateConfidence(q, intent)
    };
  }

  extractEntities(question) {
    const entities = {};
    
    // Extract department entities
    for (const [keyword, department] of Object.entries(this.departmentKeywords)) {
      if (question.includes(keyword)) {
        entities.department = department;
        break;
      }
    }
    
    // Extract course level
    if (question.includes('undergraduate') || question.includes('bachelor') || question.includes('b.')) {
      entities.courseLevel = 'undergraduate';
    } else if (question.includes('postgraduate') || question.includes('master') || question.includes('m.')) {
      entities.courseLevel = 'postgraduate';
    } else if (question.includes('phd') || question.includes('research')) {
      entities.courseLevel = 'phd';
    } else if (question.includes('diploma')) {
      entities.courseLevel = 'diploma';
    }
    
    // Extract information type
    if (question.includes('fee') || question.includes('cost') || question.includes('price')) {
      entities.infoType = 'fees';
    } else if (question.includes('duration') || question.includes('years')) {
      entities.infoType = 'duration';
    } else if (question.includes('seat') || question.includes('intake')) {
      entities.infoType = 'seats';
    } else if (question.includes('eligibility') || question.includes('qualification') || question.includes('requirement')) {
      entities.infoType = 'eligibility';
    } else if (question.includes('placement') || question.includes('job') || question.includes('career')) {
      entities.infoType = 'placement';
    } else if (question.includes('facility') || question.includes('infrastructure') || question.includes('lab')) {
      entities.infoType = 'facilities';
    } else if (question.includes('syllabus') || question.includes('subject') || question.includes('curriculum')) {
      entities.infoType = 'syllabus';
    } else if (question.includes('scholarship') || question.includes('financial')) {
      entities.infoType = 'scholarship';
    } else if (question.includes('contact') || question.includes('phone') || question.includes('email')) {
      entities.infoType = 'contact';
    }
    
    return entities;
  }

  extractDepartment(question) {
    for (const [keyword, department] of Object.entries(this.departmentKeywords)) {
      if (question.includes(keyword)) {
        return department;
      }
    }
    return null;
  }

  extractCourse(question) {
    for (const [pattern, course] of Object.entries(this.courseKeywords)) {
      if (question.includes(pattern)) {
        return course;
      }
    }
    return null;
  }

  calculateConfidence(question, intent) {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for specific patterns
    const specificPatterns = this.patterns[intent];
    if (specificPatterns) {
      for (const pattern of specificPatterns) {
        if (pattern.test(question)) {
          confidence += 0.2;
          break;
        }
      }
    }
    
    // Increase confidence if department/course is mentioned
    if (this.extractDepartment(question) || this.extractCourse(question)) {
      confidence += 0.1;
    }
    
    // Increase confidence for exact matches
    if (question.length < 20) {
      confidence += 0.1;
    }
    
    // Decrease confidence for unknown intent
    if (intent === this.intents.UNKNOWN) {
      confidence = 0.3;
    }
    
    return Math.min(confidence, 1.0);
  }

  getSuggestedQuestions(intent) {
    const suggestions = {
      [this.intents.DEPARTMENT_LIST]: [
        "List all departments",
        "Which departments are available?",
        "How many departments does the college have?",
        "Tell me about all departments"
      ],
      [this.intents.COURSE_LIST]: [
        "What courses are offered in Computer Science?",
        "List all undergraduate programs",
        "What postgraduate courses are available?",
        "Show me all B.Sc programs"
      ],
      [this.intents.PRINCIPAL_INFO]: [
        "Who is the principal?",
        "Tell me about the college principal",
        "Principal contact information",
        "Who heads the college?"
      ],
      [this.intents.PRESIDENT_INFO]: [
        "Who is the president?",
        "Tell me about the governing council president",
        "President information"
      ],
      [this.intents.CONTACT_INFO]: [
        "College contact details",
        "Phone number and email",
        "College address",
        "How to contact the college?"
      ],
      [this.intents.PLACEMENT_STATS]: [
        "What is the placement percentage?",
        "Highest package offered",
        "Which companies visit for placements?",
        "Placement statistics for IT department"
      ],
      [this.intents.FEE_STRUCTURE]: [
        "What is the fee for B.Sc IT?",
        "Fee structure for management courses",
        "Total course fees with breakdown",
        "B.Com course fees"
      ],
      [this.intents.SCHOLARSHIPS]: [
        "What scholarships are available?",
        "How to apply for merit scholarship?",
        "Financial aid options",
        "Scholarship eligibility criteria"
      ],
      [this.intents.ADMISSION_PROCESS]: [
        "How to apply for admission?",
        "Admission process for B.Sc",
        "Steps for online admission",
        "Admission requirements"
      ],
      [this.intents.FACILITIES]: [
        "What facilities are available?",
        "Tell me about college library",
        "Sports facilities",
        "Hostel information"
      ],
// Add to the suggestions object in getSuggestedQuestions method
[this.intents.NEP_OVERVIEW]: [
  "What is NEP 2020?",
  "Tell me about New Education Policy",
  "NEP implementation at RJ College",
  "National Education Policy details"
],
[this.intents.NEP_FEATURES]: [
  "Key features of NEP",
  "What are the main components of NEP?",
  "NEP 2020 features"
],
[this.intents.NEP_CREDIT_SYSTEM]: [
  "Credit system under NEP",
  "Academic Bank of Credits",
  "How does credit transfer work?"
],
[this.intents.NEP_MULTIDISCIPLINARY]: [
  "Multidisciplinary education in NEP",
  "Choice of subjects under NEP",
  "Minor and major subjects"
],
[this.intents.NEP_ENTRY_EXIT]: [
  "Multiple entry exit options",
  "Certificate and diploma options",
  "Flexible degree completion"
],
[this.intents.NEP_IMPLEMENTATION]: [
  "NEP implementation timeline",
  "How is NEP implemented in college?",
  "Current NEP status"
],
[this.intents.NEP_BENEFITS]: [
  "Benefits of NEP for students",
  "Advantages of new education policy",
  "Why NEP is good for students?"
]



    };
    
    return suggestions[intent] || [
      "Who is the principal?",
      "College contact information",
      "List all departments",
      "What courses are available?",
      "Admission process",
      "Fee structure",
      "Placement statistics",
      "College facilities"
    ];
  }
}

module.exports = NLPProcessor;