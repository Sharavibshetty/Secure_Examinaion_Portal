import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Exam API
export const examAPI = {
  getExams: () => api.get('/exams'),
  getExam: (id) => api.get(`/exams/${id}`),
  createExam: (examData) => api.post('/exams', examData),
  deleteExam: (id) => api.delete(`/exams/${id}`),
};

// Question API
export const questionAPI = {
  getQuestions: (examId) => api.get(`/questions/${examId}`),
  addQuestion: (examId, questionData) => api.post(`/questions/${examId}`, questionData),
};

// Result API
export const resultAPI = {
  submitResult: (resultData) => api.post('/results/submit', resultData),
  getStudentResults: () => api.get('/results/student'),
  getExamResults: (examId) => api.get(`/results/exam/${examId}`),
};

export default api;