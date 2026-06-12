import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Student Pages
import ExamList from './pages/student/ExamList';
import ExamAttempt from './pages/student/ExamAttempt';
import ExamResult from './pages/student/ExamResult';
import StudentResults from './pages/student/StudentResults';

// Admin Pages
import AdminExams from './pages/admin/AdminExams';
import CreateExam from './pages/admin/CreateExam';
import ManageQuestions from './pages/admin/ManageQuestions';
import ExamResults from './pages/admin/ExamResults';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Student Routes */}
        <Route 
          path="/student/exams" 
          element={
            <ProtectedRoute requiredRole="student">
              <ExamList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/exam/:examId" 
          element={
            <ProtectedRoute requiredRole="student">
              <ExamAttempt />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/result" 
          element={
            <ProtectedRoute requiredRole="student">
              <ExamResult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/results" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentResults />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/exams" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminExams />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/create-exam" 
          element={
            <ProtectedRoute requiredRole="admin">
              <CreateExam />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/exam/:examId/questions" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageQuestions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/exam/:examId/results" 
          element={
            <ProtectedRoute requiredRole="admin">
              <ExamResults />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/results" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminExams />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;