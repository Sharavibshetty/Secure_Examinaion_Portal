import React, { useState, useEffect } from 'react';
import { resultAPI } from '../../services/api';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await resultAPI.getStudentResults();
      setResults(response.data.results);
    } catch (error) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-100' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600 bg-green-100' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600 bg-blue-100' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600 bg-blue-100' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600 bg-yellow-100' };
    return { grade: 'F', color: 'text-red-600 bg-red-100' };
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Results</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results yet</h3>
            <p className="mt-1 text-sm text-gray-500">Take some exams to see your results here.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {results.map((result) => {
                const percentage = ((result.score / result.totalMarks) * 100).toFixed(2);
                const gradeInfo = getGrade(parseFloat(percentage));
                
                return (
                  <li key={result._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            {result.examId.title}
                          </h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.examId.description}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Score</dt>
                            <dd className="text-sm text-gray-900">{result.score}/{result.totalMarks}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Percentage</dt>
                            <dd className="text-sm text-gray-900">{percentage}%</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(result.submittedAt).toLocaleDateString()}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Time</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(result.submittedAt).toLocaleTimeString()}
                            </dd>
                          </div>
                        </div>
                        
                        {/* Performance Bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Performance</span>
                            <span>{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                parseFloat(percentage) >= 70 ? 'bg-green-500' :
                                parseFloat(percentage) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResults;