// backend/data/college_knowledge.js
const collegeKnowledge = {
  principal: {
    name: "Dr. Himanshu Dawda",
    title: "Principal",
    message: "Rooted in Values, Reaching for Excellence. The academic year 2022-23 marks the third year of our transformative journey under the National Education Policy (NEP) 2020."
  },

  departments: [
    {
      name: "Information Technology",
      established: "2001",
      courses: ["B.Sc. IT", "M.Sc. IT"],
      description: "Department of Information Technology offering comprehensive IT education."
    },
    {
      name: "Computer Science",
      courses: ["B.Sc. Computer Science", "M.Sc. Computer Science"],
      description: "Computer Science programs focusing on fundamentals and advanced computing."
    },
    {
      name: "Biotechnology",
      courses: ["B.Sc. Biotechnology", "M.Sc. Biotechnology"],
      description: "Biotechnology and life sciences programs."
    },
    {
      name: "Management Studies",
      courses: ["BMS (Bachelor of Management Studies)", "BBA"],
      description: "Business management and administration programs."
    },
    {
      name: "Arts",
      courses: ["B.A. in various specializations"],
      description: "Arts and humanities programs."
    },
    {
      name: "Science",
      courses: ["B.Sc. in Physics, Chemistry, Mathematics", "M.Sc. in various sciences"],
      description: "Science programs across multiple disciplines."
    },
    {
      name: "Commerce",
      courses: ["B.Com", "M.Com"],
      description: "Commerce and business programs."
    }
  ],

  admissions: {
    year: "2025-26",
    programs: [
      "Postgraduate (First Year) - MA / M.Sc / M.Com",
      "Postgraduate Diploma Program",
      "Undergraduate (2nd & 3rd Year)",
      "FYJC (11th Std) - Junior College",
      "First Year Undergraduate Program - BMS & BBA"
    ],
    process: "Online Admission through college website"
  },

  contact: {
    location: "Ghatkopar, Mumbai",
    process: "Visit college website for complete contact details"
  }
};

module.exports = collegeKnowledge;