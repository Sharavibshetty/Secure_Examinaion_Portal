const Result = require('../models/Result');

const attemptCheckMiddleware = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const studentId = req.user._id;

    const existingResult = await Result.findOne({ studentId, examId });
    
    if (existingResult) {
      return res.status(400).json({ 
        message: 'You have already attempted this exam' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = attemptCheckMiddleware;