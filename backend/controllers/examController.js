const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const { isMockDb, mockDb } = require('../config/db');

// Create exam (Admin only)
const createExam = async (req, res) => {
  try {
    const { title, description, duration, totalMarks } = req.body;

    if (isMockDb()) {
      // Mock database logic
      const exam = mockDb.createExam({
        title,
        description,
        duration: parseInt(duration),
        totalMarks: parseInt(totalMarks),
        createdBy: req.user._id || req.user.id,
        isActive: true
      });

      res.status(201).json({
        success: true,
        exam
      });
    } else {
      // MongoDB logic
      const exam = await Exam.create({
        title,
        description,
        duration,
        totalMarks,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        exam
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    let exams;
    
    if (isMockDb()) {
      // Mock database logic
      if (req.user.role === 'admin') {
        exams = mockDb.findExams();
        // Add creator info
        exams = exams.map(exam => ({
          ...exam,
          createdBy: { name: 'Admin User', email: 'admin@example.com' }
        }));
      } else {
        // For students, only show active exams
        exams = mockDb.findExams({ isActive: true });
      }
    } else {
      // MongoDB logic
      if (req.user.role === 'admin') {
        exams = await Exam.find().populate('createdBy', 'name email');
      } else {
        // For students, only show active exams
        exams = await Exam.find({ isActive: true }).select('-createdBy');
      }
    }

    res.json({
      success: true,
      exams
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single exam
const getExam = async (req, res) => {
  try {
    let exam;
    
    if (isMockDb()) {
      // Mock database logic
      exam = mockDb.findExamById(req.params.id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Check if student has already attempted this exam
      if (req.user.role === 'student') {
        const existingResult = mockDb.findResult({
          studentId: req.user._id || req.user.id,
          examId: exam._id
        });

        if (existingResult) {
          return res.status(400).json({ 
            message: 'You have already attempted this exam',
            attempted: true
          });
        }
      }
    } else {
      // MongoDB logic
      exam = await Exam.findById(req.params.id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Check if student has already attempted this exam
      if (req.user.role === 'student') {
        const existingResult = await Result.findOne({
          studentId: req.user._id,
          examId: exam._id
        });

        if (existingResult) {
          return res.status(400).json({ 
            message: 'You have already attempted this exam',
            attempted: true
          });
        }
      }
    }

    res.json({
      success: true,
      exam
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete exam (Admin only)
const deleteExam = async (req, res) => {
  try {
    if (isMockDb()) {
      // Mock database logic
      const deleted = mockDb.deleteExam(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      res.json({
        success: true,
        message: 'Exam deleted successfully'
      });
    } else {
      // MongoDB logic
      const exam = await Exam.findById(req.params.id);
      
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Delete associated questions and results
      await Question.deleteMany({ examId: exam._id });
      await Result.deleteMany({ examId: exam._id });
      await Exam.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Exam deleted successfully'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createExam,
  getExams,
  getExam,
  deleteExam
};