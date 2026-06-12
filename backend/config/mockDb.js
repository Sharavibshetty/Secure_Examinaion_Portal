// Mock database for development when MongoDB is not available
const users = [];
const exams = [];
const questions = [];
const results = [];

let userIdCounter = 1;
let examIdCounter = 1;
let questionIdCounter = 1;
let resultIdCounter = 1;

const mockDb = {
  // User operations
  createUser: (userData) => {
    const user = {
      _id: userIdCounter++,
      ...userData,
      createdAt: new Date()
    };
    users.push(user);
    return user;
  },

  findUserByEmail: (email) => {
    return users.find(user => user.email === email);
  },

  findUserById: (id) => {
    return users.find(user => user._id == id);
  },

  // Exam operations
  createExam: (examData) => {
    const exam = {
      _id: examIdCounter++,
      ...examData,
      createdAt: new Date()
    };
    exams.push(exam);
    return exam;
  },

  findExams: (filter = {}) => {
    return exams.filter(exam => {
      if (filter.isActive !== undefined) {
        return exam.isActive === filter.isActive;
      }
      return true;
    });
  },

  findExamById: (id) => {
    return exams.find(exam => exam._id == id);
  },

  deleteExam: (id) => {
    const index = exams.findIndex(exam => exam._id == id);
    if (index > -1) {
      exams.splice(index, 1);
      // Also delete related questions and results
      questions.splice(0, questions.length, ...questions.filter(q => q.examId != id));
      results.splice(0, results.length, ...results.filter(r => r.examId != id));
      return true;
    }
    return false;
  },

  // Question operations
  createQuestion: (questionData) => {
    const question = {
      _id: questionIdCounter++,
      ...questionData,
      createdAt: new Date()
    };
    questions.push(question);
    return question;
  },

  findQuestionsByExamId: (examId) => {
    return questions.filter(question => question.examId == examId);
  },

  // Result operations
  createResult: (resultData) => {
    const result = {
      _id: resultIdCounter++,
      ...resultData,
      submittedAt: new Date()
    };
    results.push(result);
    return result;
  },

  findResultsByStudentId: (studentId) => {
    return results.filter(result => result.studentId == studentId);
  },

  findResultsByExamId: (examId) => {
    return results.filter(result => result.examId == examId);
  },

  findResult: (filter) => {
    return results.find(result => {
      return Object.keys(filter).every(key => result[key] == filter[key]);
    });
  },

  // Utility
  clearAll: () => {
    users.length = 0;
    exams.length = 0;
    questions.length = 0;
    results.length = 0;
    userIdCounter = 1;
    examIdCounter = 1;
    questionIdCounter = 1;
    resultIdCounter = 1;
  }
};

module.exports = mockDb;