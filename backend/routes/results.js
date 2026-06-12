const express = require('express');
const {
  submitResult,
  getStudentResults,
  getExamResults
} = require('../controllers/resultController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const attemptCheckMiddleware = require('../middleware/attemptCheck');

const router = express.Router();

router.use(authMiddleware);

router.post('/submit', roleMiddleware(['student']), submitResult);
router.get('/student', roleMiddleware(['student']), getStudentResults);
router.get('/exam/:examId', roleMiddleware(['admin']), getExamResults);

module.exports = router;