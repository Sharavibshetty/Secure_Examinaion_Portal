import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, resultAPI } from '../../services/api';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsResponse, resultsResponse] = await Promise.all([
        examAPI.getExams(),
        resultAPI.getStudentResults()
      ]);
      
      setExams(examsResponse.data.exams);
      setResults(resultsResponse.data.results);
    } catch (error) {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const isExamAttempted = (examId) => {
    return results.some(result => result.examId._id === examId);
  };

  const getExamResult = (examId) => {
    return results.find(result => result.examId._id === examId);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Exams</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {exams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new exams.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const attempted = isExamAttempted(exam._id);
              const result = getExamResult(exam._id);
              
              return (
                <div key={exam._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                      {attempted && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{exam.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Marks:</span>
                        <span>{exam.totalMarks}</span>
                      </div>
                      {attempted && result && (
                        <div className="flex justify-between font-medium text-green-600">
                          <span>Your Score:</span>
                          <span>{result.score}/{result.totalMarks}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      {attempted ? (
                        <div className="text-center">
                          <span className="text-sm text-gray-500">
                            Exam completed on {new Date(result.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={`/student/exam/${exam._id}`}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Start Exam
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;