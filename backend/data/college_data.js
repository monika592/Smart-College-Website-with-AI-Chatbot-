// backend/data/college_data.js
const collegeData = {
  principal: {
    name: "Dr. Himanshu Dawda",
    title: "Principal",
    qualification: "Ph.D. in Computer Science, M.Tech in Software Engineering",
    experience: "18 years in academic leadership and research",
    specialization: "Artificial Intelligence, Machine Learning",
    previous_positions: [
      "Professor & Head, Computer Science Department",
      "Dean of Science Faculty",
      "Research Coordinator"
    ],
    awards: [
      "Best Principal Award 2022",
      "Excellence in Education Leadership 2021",
      "Research Innovation Award 2020"
    ],
    message: "Rooted in Values, Reaching for Excellence. The academic year 2022-23 marks the third year of our transformative journey under the National Education Policy (NEP) 2020. Our commitment to providing holistic education while nurturing innovation and research remains unwavering. We strive to create an inclusive learning environment that empowers students to become future-ready professionals and responsible citizens.",
    email: "principal@rjcollege.edu.in",
    office_hours: "10:00 AM - 5:00 PM (Monday to Friday)",
    phone: "022-2501-2301"
  },

  president: {
    name: "Dr. Rajendra Singh",
    title: "President, Governing Council",
    qualification: " M.B.B.S from G S Medical college",
    experience: "30+ years in industry and education management",
    message: "Committed to providing quality education and building future leaders. Our vision is to create an institution that not only imparts knowledge but also builds character and fosters innovation.",
    email: "president@rjcollege.edu.in"
  },

  vice_principal: {
    name: "Capt. Pravin Nayak",
    title: "Vice Principal",
    qualification: "Ph.D. in Chemistry, M.Sc. in Organic Chemistry",
    experience: "20 years in academic administration",
    specialization: "Organic Chemistry, Research Methodology",
    email: "viceprincipal@rjcollege.edu.in",
    phone: "022-2501-2302"
  },

  // Enhanced Admissions Data from website
  admissions: {
    year: "2025-26",
    process: "All admissions are conducted online through the college website",
    application_fee: {
      undergraduate: "₹500",
      postgraduate: "₹600",
      diploma: "₹400",
      international: "₹2000"
    },
    important_dates: {
      application_start: "June 1, 2025",
      application_end: "July 15, 2025",
      merit_list_first: "July 20, 2025",
      merit_list_second: "July 25, 2025",
      admission_confirmation: "July 26-30, 2025",
      classes_start: "August 1, 2025",
      late_admission: "August 1-10, 2025"
    },
    eligibility: {
      undergraduate: "12th Standard pass with minimum 45% marks from recognized board",
      postgraduate: "Bachelor's degree in relevant field with 50% marks from recognized university",
      international: "Equivalent qualification with valid student visa",
      relaxation: "5% relaxation for SC/ST candidates",
      age_limit: "No upper age limit for undergraduate and postgraduate programs",
      entrance_exams: {
        "BMS/BBA": "College Entrance Test",
        "M.Sc/M.A": "Subject-specific entrance test",
        "PhD": "Research Aptitude Test"
      },
      documents_required: [
        "10th and 12th Marksheets",
        "Transfer Certificate",
        "Migration Certificate",
        "Aadhar Card",
        "Caste Certificate (if applicable)",
        "Income Certificate (if applicable)",
        "Passport Size Photographs (4 copies)",
        "Gap Certificate (if applicable)",
        "Entrance Exam Scorecard (if applicable)"
      ]
    },
    programs: [
      {
        name: "First Year Junior College (FYJC)",
        description: "11th Standard Admission 2025-26",
        duration: "2 Years",
        fees: "₹12,000 per year",
        streams: ["Science", "Commerce", "Arts"],
        eligibility: "10th Pass with minimum 35% marks"
      },
      {
        name: "Undergraduate Programs",
        description: "Bachelor's Degree Admission 2025-26",
        duration: "3 Years",
        fees: "₹15,000 - ₹27,000 per year",
        courses: ["B.Sc", "B.Com", "B.A", "BMS", "BBA"]
      },
      {
        name: "Postgraduate Programs", 
        description: "Master's Degree Admission 2025-26",
        duration: "2 Years",
        fees: "₹20,000 - ₹39,000 per year",
        courses: ["M.Sc", "M.Com", "M.A"]
      },
      {
        name: "Postgraduate Diploma Programs",
        description: "One Year Diploma Courses",
        duration: "1 Year",
        fees: "₹20,000 - ₹25,000",
        courses: ["Data Science", "Digital Marketing", "Financial Management", "Business Analytics"]
      },
      {
        name: "PhD Programs",
        description: "Research Programs in Various Disciplines",
        duration: "3-5 Years",
        fees: "₹30,000 - ₹50,000 per year"
      }
    ],
    contact: {
      admission_cell: "022-2501-2345",
      email: "admissions@rjcollege.edu.in",
      hours: "9:00 AM - 4:00 PM (Monday to Saturday)",
      admission_officer: "Mr. Sanjay Mehta",
      helpline: "9029001234",
      international_cell: "022-2501-2348",
      address: "Admission Cell, Ground Floor, Admin Building"
    }
  },

  // Enhanced Departments with Detailed Information from website
  departments: [
    {
      name: "Information Technology",
      established: "2001",
      head: {
        name: "Mrs. Archana Bhide",
        qualification: "Ph.D. in Computer Science, M.Tech in IT",
        experience: "15 years",
        specialization: "Cloud Computing, Cybersecurity",
        email: "it.hod@rjcollege.edu.in",
        phone: "022-2501-2401"
      },
      faculty_count: 12,
      student_strength: 180,
      accreditation: "NBA Accredited",
      labs: ["Advanced Computing Lab", "Networking Lab", "Project Development Lab", "Cybersecurity Lab"],
      courses: [
        {
          name: "B.Sc. Information Technology",
          duration: "3 Years",
          seats: 60,
          eligibility: "12th Science with Mathematics (Minimum 45%)",
          fees: {
            tuition: "₹18,000 per year",
            development: "₹2,000 per year",
            laboratory: "₹3,000 per year",
            total: "₹23,000 per year"
          },
          syllabus: ["Programming Fundamentals", "Database Management", "Web Technologies", "Networking", "Software Engineering"],
          career_opportunities: ["Software Developer", "System Analyst", "Network Administrator", "IT Consultant"]
        },
        {
          name: "M.Sc. Information Technology", 
          duration: "2 Years",
          seats: 30,
          eligibility: "B.Sc. IT/Computer Science with 50% marks",
          fees: {
            tuition: "₹25,000 per year",
            development: "₹3,000 per year",
            laboratory: "₹4,000 per year",
            total: "₹32,000 per year"
          },
          syllabus: ["Advanced Algorithms", "Machine Learning", "Big Data Analytics", "Cloud Computing", "Information Security"],
          career_opportunities: ["Data Scientist", "Cloud Architect", "Cybersecurity Analyst", "IT Project Manager"]
        }
      ],
      facilities: [
        "Advanced Computer Lab (50 Systems)",
        "Programming Lab with Latest IDEs",
        "Project Development Lab",
        "Department Library",
        "Seminar Hall with Audio-Visual Equipment"
      ],
      research_areas: [
        "Artificial Intelligence",
        "Internet of Things",
        "Cybersecurity",
        "Data Science",
        "Cloud Computing"
      ],
      industry_partnerships: ["TCS", "Infosys", "Wipro", "Microsoft", "Google"],
      description: "The Department of Information Technology offers comprehensive programs in IT and computer applications with industry-oriented curriculum and excellent placement opportunities."
    },
    {
      name: "Computer Science",
      established: "1998",
      head: {
        name: "Dr. Priya Mehta",
        qualification: "Ph.D. in Computer Science, M.Tech in CS",
        experience: "18 years",
        specialization: "Artificial Intelligence, Machine Learning",
        email: "cs.hod@rjcollege.edu.in",
        phone: "022-2501-2402"
      },
      faculty_count: 15,
      student_strength: 240,
      accreditation: "NBA Accredited, ISO Certified",
      labs: ["AI Research Lab", "Software Development Lab", "Database Lab", "Computer Networks Lab"],
      courses: [
        {
          name: "B.Sc. Computer Science",
          duration: "3 Years", 
          seats: 120,
          eligibility: "12th Science with Mathematics (Minimum 45%)",
          fees: {
            tuition: "₹16,000 per year",
            development: "₹2,000 per year",
            laboratory: "₹3,000 per year",
            total: "₹21,000 per year"
          },
          syllabus: ["Computer Programming", "Data Structures", "Operating Systems", "Computer Networks", "Database Systems"],
          career_opportunities: ["Software Engineer", "Web Developer", "Database Administrator", "System Programmer"]
        },
        {
          name: "M.Sc. Computer Science",
          duration: "2 Years",
          seats: 40,
          eligibility: "B.Sc. Computer Science with 50% marks",
          fees: {
            tuition: "₹28,000 per year",
            development: "₹3,000 per year",
            laboratory: "₹4,000 per year",
            total: "₹35,000 per year"
          },
          syllabus: ["Advanced Algorithms", "Machine Learning", "Distributed Systems", "Software Architecture", "Research Methodology"],
          career_opportunities: ["Machine Learning Engineer", "Research Scientist", "Software Architect", "AI Specialist"]
        }
      ],
      facilities: [
        "High-Performance Computing Lab",
        "AI and ML Research Center",
        "Software Development Lab",
        "Department Library with 5000+ Books",
        "Conference Room"
      ],
      research_areas: [
        "Machine Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Blockchain Technology",
        "Quantum Computing"
      ],
      industry_partnerships: ["Google", "Microsoft", "Amazon", "IBM", "Intel"],
      description: "Department focusing on computer science fundamentals and advanced computing technologies with research opportunities and industry collaborations."
    },
    {
      name: "Biotechnology",
      established: "2005",
      head: {
        name: "Dr. Anjali Patel",
        qualification: "Ph.D. in Biotechnology, M.Sc. in Microbiology",
        experience: "16 years",
        specialization: "Genetic Engineering, Molecular Biology",
        email: "biotech.hod@rjcollege.edu.in",
        phone: "022-2501-2403"
      },
      faculty_count: 10,
      student_strength: 120,
      accreditation: "DBT Supported, UGC Recognized",
      labs: ["Microbiology Lab", "Biochemistry Lab", "Genetic Engineering Lab", "Tissue Culture Lab"],
      courses: [
        {
          name: "B.Sc. Biotechnology",
          duration: "3 Years",
          seats: 60,
          eligibility: "12th Science with Biology (Minimum 45%)",
          fees: {
            tuition: "₹20,000 per year",
            development: "₹2,500 per year",
            laboratory: "₹5,000 per year",
            total: "₹27,500 per year"
          },
          syllabus: ["Microbiology", "Biochemistry", "Genetics", "Immunology", "Bioinformatics"],
          career_opportunities: ["Biotech Researcher", "Quality Control Analyst", "Clinical Research Associate", "Biotech Sales"]
        },
        {
          name: "M.Sc. Biotechnology",
          duration: "2 Years", 
          seats: 30,
          eligibility: "B.Sc. Biotechnology/Life Sciences with 50% marks",
          fees: {
            tuition: "₹30,000 per year",
            development: "₹3,000 per year",
            laboratory: "₹6,000 per year",
            total: "₹39,000 per year"
          },
          syllabus: ["Molecular Biology", "Genetic Engineering", "Bioprocess Technology", "Medical Biotechnology", "Research Techniques"],
          career_opportunities: ["Research Scientist", "Biotech Product Manager", "Regulatory Affairs Specialist", "PhD Research"]
        }
      ],
      facilities: [
        "Microbiology Laboratory",
        "Biochemistry Lab",
        "Genetic Engineering Lab",
        "Tissue Culture Facility",
        "Research Laboratory"
      ],
      research_areas: [
        "Cancer Biology",
        "Stem Cell Research",
        "Environmental Biotechnology",
        "Drug Discovery",
        "Agricultural Biotechnology"
      ],
      industry_partnerships: ["Biocon", "Serum Institute", "Dr. Reddy's", "Lupin", "Sun Pharma"],
      description: "Offers programs in biological sciences and biotechnology research with modern laboratory facilities and research opportunities in cutting-edge areas."
    },
    {
      name: "Management Studies",
      established: "2010",
      head: {
        name: "Prof. Rajesh Kumar",
        qualification: "Ph.D. in Management, MBA from NMIMS",
        experience: "20 years",
        specialization: "Marketing Management, Strategic Management",
        email: "management.hod@rjcollege.edu.in",
        phone: "022-2501-2404"
      },
      faculty_count: 18,
      student_strength: 300,
      accreditation: "AICTE Approved, NBA Accredited",
      labs: ["Business Simulation Lab", "Case Study Room", "Trading Lab"],
      courses: [
        {
          name: "BMS (Bachelor of Management Studies)",
          duration: "3 Years",
          seats: 120,
          eligibility: "12th any stream with 45% marks",
          fees: {
            tuition: "₹22,000 per year",
            development: "₹3,000 per year",
            activity: "₹2,000 per year",
            total: "₹27,000 per year"
          },
          specialization: ["Marketing", "Finance", "Human Resources", "Operations"],
          career_opportunities: ["Business Analyst", "Marketing Executive", "HR Executive", "Operations Manager"]
        },
        {
          name: "BBA (Bachelor of Business Administration)",
          duration: "3 Years",
          seats: 60,
          eligibility: "12th any stream with 45% marks",
          fees: {
            tuition: "₹20,000 per year",
            development: "₹3,000 per year",
            activity: "₹2,000 per year",
            total: "₹25,000 per year"
          },
          specialization: ["Entrepreneurship", "International Business", "Digital Marketing"],
          career_opportunities: ["Business Development Executive", "Entrepreneur", "Digital Marketing Specialist", "Management Trainee"]
        }
      ],
      facilities: [
        "Business Simulation Lab",
        "Case Study Room",
        "Management Library",
        "Corporate Interaction Cell",
        "Startup Incubation Center"
      ],
      research_areas: [
        "Consumer Behavior",
        "Financial Markets",
        "Organizational Behavior",
        "Supply Chain Management",
        "Digital Transformation"
      ],
      industry_partnerships: ["HDFC Bank", "ICICI Bank", "Reliance", "Aditya Birla", "Deloitte"],
      description: "Focuses on business management and administration education with industry interface, corporate training, and excellent placement records."
    },
    {
      name: "Arts",
      established: "1963",
      head: {
        name: "Dr. Meera Desai",
        qualification: "Ph.D. in Psychology, M.A. in Clinical Psychology",
        experience: "22 years",
        specialization: "Clinical Psychology, Counseling",
        email: "arts.hod@rjcollege.edu.in",
        phone: "022-2501-2405"
      },
      faculty_count: 25,
      student_strength: 400,
      accreditation: "UGC Recognized, NAAC Accredited",
      labs: ["Psychology Lab", "Language Lab", "Media Studio"],
      courses: [
        {
          name: "B.A. in Psychology",
          duration: "3 Years",
          seats: 80,
          fees: {
            tuition: "₹12,000 per year",
            development: "₹1,500 per year",
            total: "₹13,500 per year"
          },
          career_opportunities: ["Counselor", "Clinical Psychologist", "HR Specialist", "Social Worker"]
        },
        {
          name: "B.A. in Economics",
          duration: "3 Years", 
          seats: 60,
          fees: {
            tuition: "₹12,000 per year",
            development: "₹1,500 per year",
            total: "₹13,500 per year"
          },
          career_opportunities: ["Economist", "Policy Analyst", "Banking Professional", "Research Analyst"]
        },
        {
          name: "B.A. in English Literature",
          duration: "3 Years",
          seats: 60,
          fees: {
            tuition: "₹12,000 per year",
            development: "₹1,500 per year",
            total: "₹13,500 per year"
          },
          career_opportunities: ["Content Writer", "Editor", "Teacher", "Journalist"]
        },
        {
          name: "M.A. in Psychology",
          duration: "2 Years",
          seats: 30,
          fees: {
            tuition: "₹18,000 per year",
            development: "₹2,000 per year",
            total: "₹20,000 per year"
          },
          career_opportunities: ["Clinical Psychologist", "Counseling Psychologist", "Industrial Psychologist", "Researcher"]
        }
      ],
      facilities: [
        "Psychology Laboratory",
        "Language Lab",
        "Media Studio",
        "Arts Gallery",
        "Counseling Center"
      ],
      research_areas: [
        "Clinical Psychology",
        "Economic Development",
        "Literary Criticism",
        "Social Studies",
        "Cultural Anthropology"
      ],
      industry_partnerships: ["TISS", "NGOs", "Media Houses", "Research Organizations"],
      description: "Offers diverse arts and humanities programs with focus on critical thinking, research, and comprehensive personality development."
    },
    {
      name: "Science",
      established: "1963", 
      head: {
        name: "Dr. Sanjay Verma",
        qualification: "Ph.D. in Physics, M.Sc. in Nuclear Physics",
        experience: "25 years",
        specialization: "Nuclear Physics, Material Science",
        email: "science.hod@rjcollege.edu.in",
        phone: "022-2501-2406"
      },
      faculty_count: 30,
      student_strength: 500,
      accreditation: "UGC Recognized, DBT Star College",
      labs: ["Physics Lab", "Chemistry Lab", "Mathematics Lab", "Research Lab"],
      courses: [
        {
          name: "B.Sc. in Physics, Chemistry, Mathematics",
          duration: "3 Years",
          seats: 180,
          fees: {
            tuition: "₹15,000 per year",
            development: "₹2,000 per year",
            laboratory: "₹4,000 per year",
            total: "₹21,000 per year"
          },
          career_opportunities: ["Research Scientist", "Lab Technician", "Data Analyst", "Teacher"]
        },
        {
          name: "M.Sc. in Physics",
          duration: "2 Years",
          seats: 25,
          fees: {
            tuition: "₹22,000 per year",
            development: "₹2,500 per year",
            laboratory: "₹5,000 per year",
            total: "₹29,500 per year"
          },
          career_opportunities: ["Research Physicist", "Academic Researcher", "Scientific Officer", "PhD Studies"]
        },
        {
          name: "M.Sc. in Chemistry", 
          duration: "2 Years",
          seats: 25,
          fees: {
            tuition: "₹22,000 per year",
            development: "₹2,500 per year",
            laboratory: "₹5,000 per year",
            total: "₹29,500 per year"
          },
          career_opportunities: ["Chemical Analyst", "Research Chemist", "Quality Control", "Pharmaceutical Industry"]
        },
        {
          name: "M.Sc. in Mathematics",
          duration: "2 Years",
          seats: 30,
          fees: {
            tuition: "₹20,000 per year",
            development: "₹2,000 per year",
            total: "₹22,000 per year"
          },
          career_opportunities: ["Data Scientist", "Actuary", "Statistician", "Academic Researcher"]
        }
      ],
      facilities: [
        "Advanced Physics Laboratory",
        "Chemistry Research Lab",
        "Mathematics Computer Lab",
        "Science Library",
        "Observatory"
      ],
      research_areas: [
        "Material Science",
        "Organic Chemistry",
        "Applied Mathematics",
        "Environmental Science",
        "Theoretical Physics"
      ],
      industry_partnerships: ["BARC", "TIFR", "IITs", "Research Institutes"],
      description: "Comprehensive science programs across multiple disciplines with state-of-the-art research facilities and experienced faculty."
    },
    {
      name: "Commerce",
      established: "1963",
      head: {
        name: "Prof. Vikram Singh", 
        qualification: "Ph.D. in Commerce, M.Com, CA",
        experience: "19 years",
        specialization: "Accounting, Taxation",
        email: "commerce.hod@rjcollege.edu.in",
        phone: "022-2501-2407"
      },
      faculty_count: 22,
      student_strength: 600,
      accreditation: "UGC Recognized, ICAI Partner",
      labs: ["Accounting Lab", "Trading Lab", "Taxation Lab"],
      courses: [
        {
          name: "B.Com",
          duration: "3 Years",
          seats: 240,
          fees: {
            tuition: "₹14,000 per year",
            development: "₹1,500 per year",
            total: "₹15,500 per year"
          },
          specialization: ["Accounting & Finance", "Banking & Insurance", "Taxation"],
          career_opportunities: ["Accountant", "Banking Professional", "Tax Consultant", "Financial Analyst"]
        },
        {
          name: "M.Com",
          duration: "2 Years",
          seats: 60,
          fees: {
            tuition: "₹18,000 per year",
            development: "₹2,000 per year",
            total: "₹20,000 per year"
          },
          specialization: ["Advanced Accounting", "Business Management", "Financial Markets"],
          career_opportunities: ["Financial Manager", "Investment Analyst", "Academic Researcher", "Corporate Finance"]
        }
      ],
      facilities: [
        "Accounting Lab",
        "Stock Market Simulation",
        "Commerce Library",
        "Taxation Help Desk",
        "Auditing Practice Room"
      ],
      research_areas: [
        "Financial Accounting",
        "Business Taxation",
        "Corporate Law",
        "Investment Analysis",
        "E-Commerce"
      ],
      industry_partnerships: ["KPMG", "EY", "PwC", "Grant Thornton", "BDO"],
      description: "Commerce and business education programs with industry exposure, practical training, and professional certification support."
    }
  ],

  // Comprehensive Placements Data from website
  placements: {
    overall_stats: {
      academic_year: "2023-24",
      total_students: 850,
      placed_students: 680,
      placement_percentage: 80,
      highest_package: "₹18 LPA",
      average_package: "₹6.5 LPA",
      median_package: "₹5.2 LPA",
      recruiting_companies: 95,
      internship_offers: 320
    },
    department_wise_placements: {
      "Information Technology": {
        placed: 55,
        total: 60,
        percentage: 91.6,
        highest_package: "₹18 LPA",
        average_package: "₹7.2 LPA",
        top_recruiters: ["TCS", "Infosys", "Wipro", "Accenture", "Capgemini"]
      },
      "Computer Science": {
        placed: 105,
        total: 120,
        percentage: 87.5,
        highest_package: "₹16 LPA",
        average_package: "₹6.8 LPA",
        top_recruiters: ["Google", "Microsoft", "Amazon", "IBM", "Cognizant"]
      },
      "Biotechnology": {
        placed: 48,
        total: 60,
        percentage: 80,
        highest_package: "₹12 LPA",
        average_package: "₹5.5 LPA",
        top_recruiters: ["Biocon", "Serum Institute", "Dr. Reddy's", "Lupin", "Sun Pharma"]
      },
      "Management Studies": {
        placed: 150,
        total: 180,
        percentage: 83.3,
        highest_package: "₹15 LPA",
        average_package: "₹6.0 LPA",
        top_recruiters: ["HDFC Bank", "ICICI Bank", "Reliance", "Aditya Birla", "Deloitte"]
      },
      "Commerce": {
        placed: 180,
        total: 240,
        percentage: 75,
        highest_package: "₹10 LPA",
        average_package: "₹4.8 LPA",
        top_recruiters: ["KPMG", "EY", "PwC", "Grant Thornton", "BDO"]
      },
      "Arts": {
        placed: 60,
        total: 100,
        percentage: 60,
        highest_package: "₹8 LPA",
        average_package: "₹4.2 LPA",
        top_recruiters: ["Media Houses", "NGOs", "Educational Institutes", "Research Centers"]
      },
      "Science": {
        placed: 82,
        total: 120,
        percentage: 68.3,
        highest_package: "₹9 LPA",
        average_package: "₹4.5 LPA",
        top_recruiters: ["Research Labs", "Educational Institutes", "Pharmaceutical Companies"]
      }
    },
    top_recruiters: [
      "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "Accenture",
      "IBM", "Cognizant", "Capgemini", "HDFC Bank", "ICICI Bank", "Kotak Mahindra",
      "Reliance Industries", "Aditya Birla Group", "Deloitte", "KPMG", "EY", "PwC",
      "Biocon", "Sun Pharma", "Dr. Reddy's", "Lupin", "Serum Institute"
    ],
    placement_process: {
      timeline: {
        registration: "July - August",
        company_visits: "September - March",
        pre_placement_talks: "Throughout the year",
        final_offers: "By April"
      },
      training_provided: [
        "Aptitude Training",
        "Technical Skills",
        "Group Discussion",
        "Personal Interview",
        "Resume Building",
        "Soft Skills",
        "Communication Skills",
        "Leadership Training"
      ],
      internship_opportunities: [
        "Summer Internships (2 months)",
        "Winter Internships (1 month)",
        "Live Projects",
        "Research Internships",
        "Industry Training Programs"
      ]
    },
    placement_cell: {
      head: "Dr. Anil Kapoor",
      email: "placement@rjcollege.edu.in",
      phone: "022-2501-2350",
      office_hours: "9:00 AM - 5:00 PM (Monday to Friday)",
      location: "Ground Floor, Admin Building",
      services: [
        "Career Counseling",
        "Company Coordination",
        "Interview Preparation",
        "Internship Assistance",
        "Alumni Network",
        "Resume Building Workshops",
        "Mock Interviews",
        "Industry Connect Programs"
      ]
    }
  },

  // Enhanced Achievements from website
  achievements: [
    {
      title: "Empowered Autonomous Status",
      year: "2020",
      description: "Granted autonomy by University of Mumbai for academic excellence",
      category: "Academic"
    },
    {
      title: "Best College Award", 
      year: "2019",
      description: "Awarded by University of Mumbai for overall academic excellence",
      category: "Academic"
    },
    {
      title: "A Grade NAAC Accreditation",
      year: "2018", 
      description: "Accredited with 'A' Grade (CGPA 3.28) by National Assessment and Accreditation Council",
      category: "Accreditation"
    },
    {
      title: "DBT STAR College Scheme",
      year: "2021",
      description: "Selected under DBT STAR College Scheme for strengthening science education",
      category: "Government Recognition"
    },
    {
      title: "Performance Excellence Recognition", 
      year: "2022",
      description: "Recognized for outstanding performance in academics and research",
      category: "Academic"
    },
    {
      title: "Best Placement Record",
      year: "2023",
      description: "Awarded for achieving 80% placement with top companies",
      category: "Placements"
    },
    {
      title: "Green Campus Award",
      year: "2022",
      description: "Recognized for environmental sustainability initiatives",
      category: "Infrastructure"
    },
    {
      title: "Research Excellence Award",
      year: "2021",
      description: "Awarded for outstanding research publications and projects",
      category: "Research"
    },
    {
      title: "Sports Excellence Award",
      year: "2023",
      description: "University level champions in cricket and athletics",
      category: "Sports"
    },
    {
      title: "Innovation and Incubation Center",
      year: "2022",
      description: "Establishment of center for student startups and innovation",
      category: "Innovation"
    },
    {
      title: "Best NSS Unit Award",
      year: "2022",
      description: "Recognized for outstanding social service activities",
      category: "Social Service"
    },
    {
      title: "Cultural Excellence Award",
      year: "2023",
      description: "Awarded for excellence in cultural activities and events",
      category: "Cultural"
    }
  ],

  // Enhanced Facilities from website
  facilities: [
    {
      name: "Central Library",
      description: "Fully automated library with 75,000+ books, 150+ journals, and digital resources including e-books and online databases",
      timing: "8:00 AM - 8:00 PM",
      capacity: "300 students",
      features: ["Digital Library", "Reading Rooms", "Reference Section", "E-Learning Center", "Online Database Access"],
      contact: "022-2501-2360"
    },
    {
      name: "Computer Center", 
      description: "300+ computers with high-speed internet, latest software, and 24/7 network connectivity",
      timing: "9:00 AM - 9:00 PM",
      capacity: "150 students simultaneously",
      features: ["Programming Labs", "Internet Lab", "Project Development Center", "Cybersecurity Lab", "WiFi Campus"],
      contact: "022-2501-2361"
    },
    {
      name: "Sports Complex",
      description: "Indoor and outdoor sports facilities including gymnasium, basketball court, cricket ground, and swimming pool",
      timing: "6:00 AM - 9:00 PM",
      features: ["Gymnasium", "Basketball Court", "Cricket Ground", "Football Field", "Swimming Pool", "Indoor Games", "Yoga Center"],
      contact: "022-2501-2362"
    },
    {
      name: "Auditorium",
      description: "800-seater auditorium with modern audio-visual facilities, AC, and professional sound system",
      timing: "As per events",
      features: ["AC Auditorium", "Professional Sound System", "Projection Facilities", "Green Rooms", "Stage Lighting"],
      contact: "022-2501-2363"
    },
    {
      name: "Cafeteria and Food Court",
      description: "Hygeinic food court with variety of food options, snacks, and beverages at reasonable prices",
      timing: "8:00 AM - 6:00 PM",
      capacity: "200 students",
      features: ["Multiple Counters", "Hygeinic Kitchen", "Snack Bar", "Beverage Counter", "Outdoor Seating"],
      contact: "022-2501-2364"
    },
    {
      name: "Medical Center",
      description: "Fully equipped medical center with full-time doctor, nurse, and emergency medical facilities",
      timing: "9:00 AM - 5:00 PM",
      features: ["First Aid", "Medical Consultation", "Emergency Care", "Health Checkups", "Ambulance Service"],
      contact: "022-2501-2365"
    },
    {
      name: "Hostel Facilities",
      description: "Separate hostel facilities for boys and girls with modern amenities and security",
      capacity: "200 students",
      features: ["AC/Non-AC Rooms", "Mess Facility", "WiFi", "Common Room", "24/7 Security", "Laundry", "Recreation Room"],
      contact: "022-2501-2366"
    },
    {
      name: "Research Centers",
      description: "Department-specific research centers with advanced equipment and funding opportunities",
      features: ["AI Research Center", "Biotech Research Lab", "Commerce Research Cell", "Science Research Center", "Innovation Hub"],
      contact: "022-2501-2367"
    },
    {
      name: "Language Lab",
      description: "Modern language laboratory for enhancing communication skills",
      timing: "9:00 AM - 5:00 PM",
      features: ["Audio-Visual Equipment", "Language Software", "Individual Booths", "Group Discussion Area"],
      contact: "022-2501-2368"
    },
    {
      name: "Incubation Center",
      description: "Startup incubation center for student entrepreneurs",
      timing: "9:00 AM - 6:00 PM",
      features: ["Mentorship Programs", "Funding Support", "Workspace", "Networking Events", "Industry Connect"],
      contact: "022-2501-2369"
    }
  ],

  // Enhanced Scholarships and Financial Aid
  scholarships: [
    {
      name: "Merit Scholarship",
      eligibility: "Students with 90%+ in previous qualifying examination",
      amount: "50% tuition fee waiver",
      application_period: "July-August",
      documents_required: ["Marksheet", "Income Certificate"]
    },
    {
      name: "Economically Backward Scholarship",
      eligibility: "Family income less than ₹2.5 Lakhs per annum",
      amount: "Full tuition fee waiver",
      documents_required: ["Income Certificate", "Caste Certificate"],
      application_period: "July-September"
    },
    {
      name: "Sports Scholarship",
      eligibility: "State/National level sports achievers",
      amount: "25-50% tuition fee waiver",
      documents_required: ["Sports Achievement Certificates"],
      application_period: "Throughout the year"
    },
    {
      name: "SC/ST Scholarship",
      eligibility: "SC/ST category students",
      amount: "Full tuition fee + maintenance allowance",
      application: "Through Government Portal",
      documents_required: ["Caste Certificate", "Income Certificate"]
    },
    {
      name: "Single Girl Child Scholarship",
      eligibility: "Only girl child in family",
      amount: "30% tuition fee waiver",
      documents_required: ["Affidavit", "Birth Certificate"],
      application_period: "July-August"
    },
    {
      name: "Physically Challenged Scholarship",
      eligibility: "Students with physical disabilities (40% and above)",
      amount: "Full tuition fee waiver + special assistance",
      documents_required: ["Disability Certificate", "Medical Reports"],
      application_period: "July-September"
    },
    {
      name: "Cultural Scholarship",
      eligibility: "Students with achievements in cultural activities",
      amount: "25% tuition fee waiver",
      documents_required: ["Achievement Certificates"],
      application_period: "Throughout the year"
    }
  ],

  // Enhanced Events and Activities from website
  events: {
    academic: [
      {
        name: "Annual Tech Fest - TECHNOZION",
        month: "February",
        description: "Technical festival with coding competitions, workshops, and tech exhibitions",
        duration: "3 days",
        highlights: ["Hackathon", "Robotics Competition", "Tech Workshops", "Startup Expo"]
      },
      {
        name: "Cultural Fest - UTSAV",
        month: "March", 
        description: "Cultural festival with music, dance, drama and literary events",
        duration: "3 days",
        highlights: ["Dance Competition", "Music Festival", "Drama Performance", "Literary Events"]
      },
      {
        name: "Science Exhibition",
        month: "December",
        description: "Annual science exhibition showcasing student projects and innovations",
        duration: "2 days",
        highlights: ["Project Display", "Innovation Showcase", "Science Quiz", "Guest Lectures"]
      },
      {
        name: "Management Fest - CORPOREA",
        month: "January",
        description: "Business and management festival with case studies and corporate events",
        duration: "2 days",
        highlights: ["Business Plan Competition", "Case Study Challenge", "Corporate Quiz", "Leadership Summit"]
      }
    ],
    sports: [
      {
        name: "Annual Sports Day",
        month: "January",
        description: "Inter-department sports competitions and athletic events",
        duration: "1 day",
        highlights: ["Track Events", "Field Events", "Team Sports", "Prize Distribution"]
      },
      {
        name: "Cricket Tournament",
        month: "October",
        description: "Inter-college cricket championship",
        duration: "1 week",
        highlights: ["Inter-College Matches", "Final Match", "Trophy Distribution"]
      },
      {
        name: "Basketball Championship",
        month: "November",
        description: "College level basketball competition",
        duration: "3 days",
        highlights: ["Team Matches", "Skills Challenge", "Championship Final"]
      }
    ],
    cultural: [
      {
        name: "Freshers Party",
        month: "August",
        description: "Welcome party for new students",
        duration: "1 day",
        highlights: ["Cultural Performances", "Games", "DJ Night"]
      },
      {
        name: "Farewell Party",
        month: "April",
        description: "Farewell for final year students",
        duration: "1 day",
        highlights: ["Award Ceremony", "Cultural Events", "Farewell Speech"]
      }
    ]
  },

  // Student Support Services
  student_support: {
    counseling: {
      available: true,
      services: ["Academic Counseling", "Career Guidance", "Personal Counseling", "Stress Management"],
      timing: "10:00 AM - 4:00 PM (Monday to Friday)",
      contact: "022-2501-2370"
    },
    ncc: {
      available: true,
      units: ["Army Wing", "Navy Wing"],
      activities: ["Drill Practice", "Adventure Camps", "Social Service", "Leadership Training"],
      contact: "022-2501-2371"
    },
    nss: {
      available: true,
      activities: ["Blood Donation Camps", "Tree Plantation", "Social Awareness", "Rural Development"],
      contact: "022-2501-2372"
    },
    clubs: {
      available: true,
      list: [
        "Drama Club",
        "Music Club", 
        "Dance Club",
        "Photography Club",
        "Literary Club",
        "Debate Club",
        "Eco Club",
        "Tech Club"
      ]
    }
  },

  // Enhanced Contact Information from website
  contact: {
    address: "Ramniranjan Jhunjhunwala College, Ghatkopar (West), Mumbai - 400086, Maharashtra, India",
    location: {
      landmark: "Opposite to ghatkopar railway station !",
      coordinates: {
        latitude: "19.0865",
        longitude: "72.9081"
      },
      transportation: {
        railway: "Ghatkopar Railway Station (5 minutes walk)",
        metro: "Ghatkopar Metro Station (5 minutes walk)",
        bus: "Multiple bus routes available",
        parking: "Limited parking available for students and staff"
      }
    },
    phone: {
      main: "022-2501-2345",
      admission: "022-2501-2346", 
      administration: "022-2501-2347",
      principal: "022-2501-2301",
      placement: "022-2501-2350",
      accounts: "022-2501-2351",
      library: "022-2501-2360"
    },
    email: {
      general: "info@rjcollege.edu.in",
      admission: "admissions@rjcollege.edu.in", 
      principal: "principal@rjcollege.edu.in",
      placement: "placement@rjcollege.edu.in",
      accounts: "accounts@rjcollege.edu.in",
      library: "library@rjcollege.edu.in"
    },
    website: "www.rjcollege.edu.in",
    social_media: {
      facebook: "facebook.com/rjcollege",
      twitter: "twitter.com/rjcollege",
      linkedin: "linkedin.com/school/rjcollege",
      instagram: "instagram.com/rjcollege_official",
      youtube: "youtube.com/rjcollege"
    },
    working_hours: {
      college: "7:00 AM - 7:00 PM (Monday to Saturday)",
      office: "9:00 AM - 5:00 PM (Monday to Friday)",
      library: "8:00 AM - 8:00 PM (Monday to Saturday)"
    }
  },

  // Enhanced College Information from website
  college_info: {
    name: "Ramniranjan Jhunjhunwala College",
    location: "Ghatkopar, Mumbai",
    type: "Autonomous College",
    affiliation: "University of Mumbai",
    established: "1963",
    motto: "Knowledge is Power",
    vision: "To be a center of excellence in education, research, and innovation that transforms students into responsible global citizens and future leaders",
    mission: "To provide quality education that fosters intellectual growth, promotes research and innovation, develops professional competence, and instills ethical values and social responsibility",
    campus_size: "5 acres",
    student_strength: "5000+",
    faculty_count: "200+",
    administrative_staff: "150+",
    library_books: "75,000+",
    laboratories: "25+",
    classrooms: "60+",
    auditoriums: "2",
    sports_grounds: "3",
    computer_labs: "8",
    special_features: [
      "WiFi Enabled Campus",
      "Digital Classrooms",
      "Research Centers",
      "Incubation Center",
      "Sports Complex",
      "Hostel Facilities",
      "Medical Center",
      "Cafeteria and Food Court"
    ]
  },

// Add this to the collegeData object in college_data.js

// New Education Policy 2020 Implementation
nep_implementation: {
  overview: "RJ College has been at the forefront of implementing the National Education Policy 2020 since 2022-23 academic year. The policy focuses on holistic development, multidisciplinary education, and skill enhancement.",
  
  key_features: [
    {
      title: "Multidisciplinary Education",
      description: "Students can choose subjects across disciplines with flexible credit system",
      benefits: [
        "Choice of minors and electives from different departments",
        "Interdisciplinary learning opportunities",
        "Enhanced employability through diverse skill sets"
      ]
    },
    {
      title: "Multiple Entry/Exit Options",
      description: "Flexible academic pathways with certificate, diploma, and degree options",
      levels: [
        {
          level: "Certificate",
          duration: "1 Year",
          credits: "40-44 credits",
          eligibility: "Completion of first year"
        },
        {
          level: "Diploma",
          duration: "2 Years",
          credits: "80-88 credits", 
          eligibility: "Completion of second year"
        },
        {
          level: "Bachelor's Degree",
          duration: "3-4 Years",
          credits: "120-132 credits",
          eligibility: "Completion of three/four years"
        }
      ]
    },
    {
      title: "Academic Bank of Credits (ABC)",
      description: "Digital repository for academic credits earned by students",
      features: [
        "Storage of academic credits",
        "Credit transfer between institutions",
        "Multiple entry-exit flexibility",
        "Lifelong learning opportunities"
      ]
    },
    {
      title: "Skill Enhancement",
      description: "Integration of vocational skills and internships in curriculum",
      components: [
        "Vocational courses from 6th semester",
        "Summer internships",
        "Apprenticeship programs",
        "Industry-academia collaboration"
      ]
    }
  ],

  implementation_timeline: {
    "2022-23": "Phase 1 - Foundation year with basic NEP structure",
    "2023-24": "Phase 2 - Full implementation of credit system and multidisciplinary approach",
    "2024-25": "Phase 3 - Advanced features including ABC and skill integration",
    "2025-26": "Phase 4 - Complete NEP ecosystem with all features operational"
  },

  credit_structure: {
    undergraduate: {
      "3-year Bachelor's": "120-132 credits",
      "4-year Bachelor's (Honors)": "160 credits",
      "4-year Bachelor's (Honors with Research)": "160 credits with research project"
    },
    postgraduate: {
      "2-year Master's": "80 credits",
      "1-year PG Diploma": "40 credits"
    }
  },

  major_disciplines: [
    {
      name: "Sciences",
      departments: ["Computer Science", "Information Technology", "Biotechnology", "Science"],
      courses: ["B.Sc", "M.Sc", "Integrated Programs"]
    },
    {
      name: "Commerce & Management", 
      departments: ["Commerce", "Management Studies"],
      courses: ["B.Com", "M.Com", "BMS", "BBA", "MBA"]
    },
    {
      name: "Arts & Humanities",
      departments: ["Arts"],
      courses: ["B.A", "M.A", "Integrated Programs"]
    }
  ],

  student_benefits: [
    "Flexible choice of subjects across disciplines",
    "Multiple entry and exit options with proper certification",
    "Skill-based education with vocational training",
    "Industry-relevant curriculum",
    "Research opportunities from undergraduate level",
    "International mobility through credit transfer",
    "Lifelong learning opportunities"
  ],

  contact: {
    nep_cell: "022-2501-2390",
    email: "nep@rjcollege.edu.in",
    coordinator: "Dr. Sunita Sharma",
    office: "NEP Implementation Cell, First Floor, Admin Building",
    hours: "10:00 AM - 5:00 PM (Monday to Friday)"
  }
},
  
};

module.exports = collegeData;