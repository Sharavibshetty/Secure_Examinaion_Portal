const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(options) {
        return options.length === 4;
      },
      message: 'Exactly 4 options are required'
    }
  },
  correctOption: {
    type: Number,
    required: [true, 'Correct option is required'],
    min: 0,
    max: 3
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);