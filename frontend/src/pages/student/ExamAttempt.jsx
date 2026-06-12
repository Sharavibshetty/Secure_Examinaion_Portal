import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, questionAPI, resultAPI } from '../../services/api';
import Timer from '../../components/Timer';

const ExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount === 1) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 5000);
          } else if (newCount >= 3) {
            handleSubmit(true); // Auto-submit on multiple tab switches
          }
          return newCount;
        });
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to prevent back navigation
    window.history.pushState(null, null, window.location.pathname);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    fetchExamData();
  }, [examId]);

  const fetchExamData = async () => {
    try {
      const [examResponse, questionsResponse] = await Promise.all([
        examAPI.getExam(examId),
        questionAPI.getQuestions(examId)
      ]);
      
      if (examResponse.data.attempted) {
        navigate('/student/exams');
        return;
      }
      
      setExam(examResponse.data.exam);
      setQuestions(questionsResponse.data.questions);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption: parseInt(selectedOption)
      }));

      const response = await resultAPI.submitResult({
        examId,
        answers: formattedAnswers
      });

      navigate('/student/result', { 
        state: { 
          result: response.data.result,
          examTitle: exam.title,
          autoSubmitted: autoSubmit
        }
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit exam');
      setSubmitting(false);
    }
  }, [examId, answers, exam, navigate, submitting]);

  const handleTimeUp = useCallback(() => {
    handleSubmit(true);
  }, [handleSubmit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer */}
      {exam && <Timer duration={exam.duration} onTimeUp={handleTimeUp} />}
      
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">Warning!</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Tab switching detected! Your exam will be auto-submitted if you switch tabs {3 - tabSwitchCount} more time(s).
            </p>
            <button
              onClick={() => setShowWarning(false)}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Exam Header */}
        <div className="bg-white shadow rounded-lg mb-6 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam?.title}</h1>
          <p className="text-gray-600 mb-4">{exam?.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total Questions: {questions.length}</span>
            <span>Total Marks: {exam?.totalMarks}</span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-white shadow rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Question {index + 1} ({question.marks} marks)
                </h3>
                <p className="text-gray-700">{question.questionText}</p>
              </div>
              
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question._id}`}
                      value={optionIndex}
                      checked={answers[question._id] === optionIndex.toString()}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-gray-700">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamAttempt;