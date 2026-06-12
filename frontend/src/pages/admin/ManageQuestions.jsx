import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, questionAPI } from '../../services/api';

const ManageQuestions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    marks: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      const [examResponse, questionsResponse] = await Promise.all([
        examAPI.getExam(examId),
        questionAPI.getQuestions(examId)
      ]);
      
      setExam(examResponse.data.exam);
      setQuestions(questionsResponse.data.questions);
    } catch (error) {
      setError('Failed to fetch exam data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option-')) {
      const index = parseInt(name.split('-')[1]);
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData({ ...formData, options: newOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const questionData = {
        ...formData,
        correctOption: parseInt(formData.correctOption),
        marks: parseInt(formData.marks)
      };

      await questionAPI.addQuestion(examId, questionData);
      
      // Reset form and refresh questions
      setFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        marks: ''
      });
      setShowAddForm(false);
      await fetchData();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
              <p className="mt-2 text-sm text-gray-600">
                {exam?.title} - {questions.length} questions
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate('/admin/exams')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Exams
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {showAddForm ? 'Cancel' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Question Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Add New Question</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">
                  Question Text *
                </label>
                <textarea
                  name="questionText"
                  id="questionText"
                  rows={3}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your question here..."
                  value={formData.questionText}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Answer Options *
                </label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctOption"
                        value={index}
                        checked={formData.correctOption === index}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label className="text-sm font-medium text-gray-700 w-8">
                        {String.fromCharCode(65 + index)}.
                      </label>
                      <input
                        type="text"
                        name={`option-${index}`}
                        required
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        value={option}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div>
                <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
                  Marks *
                </label>
                <input
                  type="number"
                  name="marks"
                  id="marks"
                  min="1"
                  required
                  className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5"
                  value={formData.marks}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions added</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first question.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question._id} className="bg-white shadow rounded-lg">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Question {index + 1} ({question.marks} marks)
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{question.questionText}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`flex items-center p-2 rounded ${
                          question.correctOption === optionIndex
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-gray-700 w-8">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span className="text-gray-700">{option}</span>
                        {question.correctOption === optionIndex && (
                          <span className="ml-auto text-green-600 text-sm font-medium">
                            ✓ Correct Answer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuestions;