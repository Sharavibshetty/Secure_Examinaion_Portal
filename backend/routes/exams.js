const express = require('express');
const {
  createExam,
  getExams,
  getExam,
  deleteExam
} = require('../controllers/examController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin']), createExam);
router.get('/', getExams);
router.get('/:id', getExam);
router.delete('/:id', roleMiddleware(['admin']), deleteExam);

module.exports = router;