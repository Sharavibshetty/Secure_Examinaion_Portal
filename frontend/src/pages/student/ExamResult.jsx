import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ExamResult = () => {
  const location = useLocation();
  const { result, examTitle, autoSubmitted } = location.state || {};

  if (!result) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Result Found</h1>
          <Link
            to="/student/exams"
            className="text-blue-600 hover:text-blue-500"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  const percentage = parseFloat(result.percentage);
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const gradeInfo = getGrade(percentage);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Exam Result</h1>
          <h2 className="text-xl opacity-90">{examTitle}</h2>
          {autoSubmitted && (
            <div className="mt-4 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-md p-3">
              <p className="text-sm">
                ⚠️ This exam was auto-submitted due to time expiry or policy violation
              </p>
            </div>
          )}
        </div>

        {/* Result Details */}
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score */}
            <div className="text-center">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {result.score}
                </div>
                <div className="text-sm text-gray-600">Score Obtained</div>
              </div>
            </div>

            {/* Total Marks */}
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-gray-600 mb-2">
                  {result.totalMarks}
                </div>
                <div className="text-sm text-gray-600">Total Marks</div>
              </div>
            </div>

            {/* Percentage */}
            <div className="text-center">
              <div className="bg-green-50 rounded-lg p-6">
                <div className={`text-3xl font-bold mb-2 ${gradeInfo.color}`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
            </div>
          </div>

          {/* Grade */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="text-sm text-gray-600 mb-2">Grade</div>
              <div className={`text-6xl font-bold ${gradeInfo.color}`}>
                {gradeInfo.grade}
              </div>
            </div>
          </div>

          {/* Performance Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Performance</span>
              <span>{result.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage >= 70 ? 'bg-green-500' :
                  percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="text-center mb-8">
            {percentage >= 90 && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                🎉 Excellent performance! Outstanding work!
              </div>
            )}
            {percentage >= 70 && percentage < 90 && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                👍 Good job! Well done!
              </div>
            )}
            {percentage >= 50 && percentage < 70 && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                📚 Fair performance. Keep studying!
              </div>
            )}
            {percentage < 50 && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                📖 Need improvement. Don't give up!
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/student/exams"
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Exams
            </Link>
            <Link
              to="/student/results"
              className="px-6 py-3 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;