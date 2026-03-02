// ─── Sample Database ──────────────────────────────────────────────────────────

export const students = [
  {
    id: '2021-00142',
    initials: 'MA',
    name: 'Maria Santos',
    dateOfBirth: 'March 14, 2002',
    email: 'maria.santos@student.edu.ph',
    phone: '09171234567',
    address: 'Brgy. Bagong Silang, Caloocan City',
    gender: 'Female',
    program: 'BS Computer Science',
    yearLevel: '3rd Year',
    section: 'BSCS 3-A',
    semester: '1st Semester, A.Y. 2024–2025',
    adviser: 'Dr. Jose Reyes',
    grades: [
      { code: 'CS301', description: 'Data Structures & Algorithms', units: 3, midterm: 88, finals: 91, finalGrade: 1.5, remarks: 'Passed' },
      { code: 'CS302', description: 'Object-Oriented Programming',  units: 3, midterm: 92, finals: 94, finalGrade: 1.25, remarks: 'Passed' },
      { code: 'CS303', description: 'Database Management Systems',  units: 3, midterm: 85, finals: 87, finalGrade: 1.75, remarks: 'Passed' },
      { code: 'MATH201', description: 'Discrete Mathematics',       units: 3, midterm: 78, finals: 80, finalGrade: 2.0, remarks: 'Passed' },
      { code: 'GE101', description: 'Ethics & Values',              units: 3, midterm: 90, finals: 92, finalGrade: 1.5, remarks: 'Passed' },
    ]
  },
  {
    id: '2022-00315',
    initials: 'JC',
    name: 'Juan Cruz',
    dateOfBirth: 'July 5, 2003',
    email: 'juan.cruz@student.edu.ph',
    phone: '09281234567',
    address: 'Brgy. Sta. Cruz, Manila',
    gender: 'Male',
    program: 'BS Information Technology',
    yearLevel: '2nd Year',
    section: 'BSIT 2-B',
    semester: '1st Semester, A.Y. 2024–2025',
    adviser: 'Prof. Ana Lim',
    grades: [
      { code: 'IT201', description: 'Web Development', units: 3, midterm: 83, finals: 86, finalGrade: 1.75, remarks: 'Passed' },
      { code: 'IT202', description: 'Networking Fundamentals', units: 3, midterm: 79, finals: 81, finalGrade: 2.0, remarks: 'Passed' },
      { code: 'IT203', description: 'Systems Analysis & Design', units: 3, midterm: 88, finals: 90, finalGrade: 1.5, remarks: 'Passed' },
    ]
  },
  {
    id: '2023-00478',
    initials: 'AC',
    name: 'Angela Dela Cruz',
    dateOfBirth: 'November 20, 2004',
    email: 'angela.dc@student.edu.ph',
    phone: '09391234567',
    address: 'Brgy. Poblacion, Makati City',
    gender: 'Female',
    program: 'BS Computer Engineering',
    yearLevel: '1st Year',
    section: 'BSCpE 1-C',
    semester: '1st Semester, A.Y. 2024–2025',
    adviser: 'Engr. Marco Santos',
    grades: [
      { code: 'ENG101', description: 'Engineering Drawing', units: 3, midterm: 91, finals: 93, finalGrade: 1.25, remarks: 'Passed' },
      { code: 'MATH101', description: 'Calculus I', units: 4, midterm: 87, finals: 89, finalGrade: 1.5, remarks: 'Passed' },
    ]
  }
]

export const faculty = [
  {
    id: 'FAC-2015-004',
    initials: 'JR',
    name: 'Dr. Jose Reyes',
    dateOfBirth: 'June 10, 1978',
    email: 'jose.reyes@faculty.edu.ph',
    phone: '09171112222',
    address: 'Brgy. Loyola Heights, Quezon City',
    gender: 'Male',
    department: 'Computer Science',
    position: 'Associate Professor',
    specialization: 'Artificial Intelligence & Machine Learning',
    yearsOfService: '9 years',
    education: 'Ph.D. Computer Science, UP Diliman',
    subjects: [
      { code: 'CS301', description: 'Data Structures & Algorithms', section: 'BSCS 3-A', units: 3, schedule: 'MWF 7:30–8:30 AM', room: 'CS Lab 1', enrolled: 32 },
      { code: 'CS401', description: 'Machine Learning',             section: 'BSCS 4-A', units: 3, schedule: 'TTH 9:00–10:30 AM', room: 'CS Lab 2', enrolled: 28 },
      { code: 'CS402', description: 'Artificial Intelligence',      section: 'BSCS 4-B', units: 3, schedule: 'MWF 10:30–11:30 AM', room: 'CS Lab 1', enrolled: 30 },
    ]
  },
  {
    id: 'FAC-2018-011',
    initials: 'AL',
    name: 'Prof. Ana Lim',
    dateOfBirth: 'February 22, 1985',
    email: 'ana.lim@faculty.edu.ph',
    phone: '09282223333',
    address: 'Brgy. Pinyahan, Quezon City',
    gender: 'Female',
    department: 'Information Technology',
    position: 'Assistant Professor',
    specialization: 'Web Technologies & Software Engineering',
    yearsOfService: '6 years',
    education: 'M.S. Information Technology, DLSU',
    subjects: [
      { code: 'IT201', description: 'Web Development',          section: 'BSIT 2-B', units: 3, schedule: 'MWF 8:30–9:30 AM', room: 'IT Lab 3', enrolled: 35 },
      { code: 'IT301', description: 'Software Engineering',     section: 'BSIT 3-A', units: 3, schedule: 'TTH 1:00–2:30 PM', room: 'IT Lab 1', enrolled: 30 },
      { code: 'IT302', description: 'Mobile App Development',   section: 'BSIT 3-B', units: 3, schedule: 'MWF 2:30–3:30 PM', room: 'IT Lab 2', enrolled: 27 },
    ]
  },
  {
    id: 'FAC-2010-002',
    initials: 'MS',
    name: 'Engr. Marco Santos',
    dateOfBirth: 'September 3, 1975',
    email: 'marco.santos@faculty.edu.ph',
    phone: '09393334444',
    address: 'Brgy. Kapitolyo, Pasig City',
    gender: 'Male',
    department: 'Computer Engineering',
    position: 'Full Professor',
    specialization: 'Embedded Systems & IoT',
    yearsOfService: '14 years',
    education: 'Ph.D. Computer Engineering, ADMU',
    subjects: [
      { code: 'ENG101', description: 'Engineering Drawing',       section: 'BSCpE 1-C', units: 3, schedule: 'TTH 7:30–9:00 AM', room: 'Eng Room 2', enrolled: 38 },
      { code: 'CPE301', description: 'Microprocessor Systems',    section: 'BSCpE 3-A', units: 3, schedule: 'MWF 11:30 AM–12:30 PM', room: 'Eng Lab 1', enrolled: 25 },
      { code: 'CPE401', description: 'Embedded Systems Design',   section: 'BSCpE 4-A', units: 3, schedule: 'TTH 2:30–4:00 PM', room: 'Eng Lab 2', enrolled: 22 },
    ]
  }
]

// Default login credentials → first record of each type
export const defaultStudent = students[0]
export const defaultFaculty = faculty[0]
