const Question = require('../models/Question');
const Exam = require('../models/Exam');
const { isMockDb, mockDb } = require('../config/db');

// Add question to exam (Admin only)
const addQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionText, options, correctOption, marks } = req.body;

    if (isMockDb()) {
      // Mock database logic
      const exam = mockDb.findExamById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      const question = mockDb.createQuestion({
        examId: parseInt(examId),
        questionText,
        options,
        correctOption: parseInt(correctOption),
        marks: parseInt(marks)
      });

      // Update exam total marks
      const allQuestions = mockDb.findQuestionsByExamId(examId);
      const newTotalMarks = allQuestions.reduce((total, q) => total + q.marks, 0);
      
      // Update exam in mock database
      const examIndex = mockDb.findExams().findIndex(e => e._id == examId);
      if (examIndex !== -1) {
        mockDb.findExams()[examIndex].totalMarks = newTotalMarks;
      }

      res.status(201).json({
        success: true,
        question
      });
    } else {
      // MongoDB logic
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      const question = await Question.create({
        examId,
        questionText,
        options,
        correctOption,
        marks
      });

      // Update exam total marks
      const totalQuestionMarks = await Question.aggregate([
        { $match: { examId: exam._id } },
        { $group: { _id: null, total: { $sum: '$marks' } } }
      ]);

      const newTotalMarks = totalQuestionMarks[0]?.total || 0;
      await Exam.findByIdAndUpdate(examId, { totalMarks: newTotalMarks });

      res.status(201).json({
        success: true,
        question
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get questions for exam
const getQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    if (isMockDb()) {
      // Mock database logic
      const exam = mockDb.findExamById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      let questions = mockDb.findQuestionsByExamId(examId);

      // For students, don't send correct answers
      if (req.user.role === 'student') {
        questions = questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options,
          marks: q.marks
        }));
      }

      res.json({
        success: true,
        questions
      });
    } else {
      // MongoDB logic
      const exam = await Exam.findById(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      let questions = await Question.find({ examId });

      // For students, don't send correct answers
      if (req.user.role === 'student') {
        questions = questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options,
          marks: q.marks
        }));
      }

      res.json({
        success: true,
        questions
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addQuestion,
  getQuestions
};