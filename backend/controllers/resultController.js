const Result = require('../models/Result');
const Question = require('../models/Question');
const Exam = require('../models/Exam');
const { isMockDb, mockDb } = require('../config/db');

// Submit exam result
const submitResult = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user._id || req.user.id;

    if (isMockDb()) {
      // Mock database logic
      const existingResult = mockDb.findResult({ studentId, examId: parseInt(examId) });
      if (existingResult) {
        return res.status(400).json({ message: 'Exam already attempted' });
      }

      const questions = mockDb.findQuestionsByExamId(examId);
      const exam = mockDb.findExamById(examId);

      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Calculate score
      let score = 0;
      const processedAnswers = [];

      for (const answer of answers) {
        const question = questions.find(q => q._id == answer.questionId);
        if (question) {
          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption
          });

          if (question.correctOption === answer.selectedOption) {
            score += question.marks;
          }
        }
      }

      // Save result
      const result = mockDb.createResult({
        studentId,
        examId: parseInt(examId),
        score,
        totalMarks: exam.totalMarks,
        answers: processedAnswers
      });

      res.status(201).json({
        success: true,
        result: {
          score,
          totalMarks: exam.totalMarks,
          percentage: ((score / exam.totalMarks) * 100).toFixed(2)
        }
      });
    } else {
      // MongoDB logic
      const existingResult = await Result.findOne({ studentId, examId });
      if (existingResult) {
        return res.status(400).json({ message: 'Exam already attempted' });
      }

      const questions = await Question.find({ examId });
      const exam = await Exam.findById(examId);

      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Calculate score
      let score = 0;
      const processedAnswers = [];

      for (const answer of answers) {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (question) {
          processedAnswers.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption
          });

          if (question.correctOption === answer.selectedOption) {
            score += question.marks;
          }
        }
      }

      // Save result
      const result = await Result.create({
        studentId,
        examId,
        score,
        totalMarks: exam.totalMarks,
        answers: processedAnswers
      });

      res.status(201).json({
        success: true,
        result: {
          score,
          totalMarks: exam.totalMarks,
          percentage: ((score / exam.totalMarks) * 100).toFixed(2)
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student results
const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;

    if (isMockDb()) {
      // Mock database logic
      const results = mockDb.findResultsByStudentId(studentId);
      
      // Add exam info to results
      const resultsWithExamInfo = results.map(result => ({
        ...result,
        examId: {
          _id: result.examId,
          title: mockDb.findExamById(result.examId)?.title || 'Unknown Exam',
          description: mockDb.findExamById(result.examId)?.description || ''
        }
      })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

      res.json({
        success: true,
        results: resultsWithExamInfo
      });
    } else {
      // MongoDB logic
      const results = await Result.find({ studentId })
        .populate('examId', 'title description')
        .sort({ submittedAt: -1 });

      res.json({
        success: true,
        results
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get exam results (Admin only)
const getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;

    if (isMockDb()) {
      // Mock database logic
      const results = mockDb.findResultsByExamId(parseInt(examId));
      
      // Add student and exam info to results
      const resultsWithInfo = results.map(result => ({
        ...result,
        studentId: {
          _id: result.studentId,
          name: mockDb.findUserById(result.studentId)?.name || 'Unknown Student',
          email: mockDb.findUserById(result.studentId)?.email || ''
        },
        examId: {
          _id: result.examId,
          title: mockDb.findExamById(result.examId)?.title || 'Unknown Exam',
          totalMarks: result.totalMarks
        }
      })).sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        results: resultsWithInfo
      });
    } else {
      // MongoDB logic
      const results = await Result.find({ examId })
        .populate('studentId', 'name email')
        .populate('examId', 'title totalMarks')
        .sort({ score: -1 });

      res.json({
        success: true,
        results
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitResult,
  getStudentResults,
  getExamResults
};