import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Secure Exam System
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              Welcome, {user.name} ({user.role})
            </span>
            
            {user.role === 'admin' && (
              <div className="flex space-x-2">
                <Link
                  to="/admin/exams"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Manage Exams
                </Link>
                <Link
                  to="/admin/results"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  View Results
                </Link>
              </div>
            )}
            
            {user.role === 'student' && (
              <div className="flex space-x-2">
                <Link
                  to="/student/exams"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Exams
                </Link>
                <Link
                  to="/student/results"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  My Results
                </Link>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;