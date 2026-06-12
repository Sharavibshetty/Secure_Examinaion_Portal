const express = require('express');
const { addQuestion, getQuestions } = require('../controllers/questionController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/:examId', roleMiddleware(['admin']), addQuestion);
router.get('/:examId', getQuestions);

module.exports = router;