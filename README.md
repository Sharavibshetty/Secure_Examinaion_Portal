# 🔐 Secure Online Examination System

A complete MERN stack application for conducting secure online examinations with role-based access control, anti-cheating mechanisms, and comprehensive result management.

## 🚀 Features

### 👥 User Roles
- **Admin**: Create exams, manage questions, view results
- **Student**: Take exams, view results

### 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected routes (frontend & backend)
- Anti-cheating mechanisms:
  - Tab switch detection
  - Auto-submit on multiple violations
  - Disabled page refresh during exam
  - Back button navigation blocked

### 📝 Exam Management
- Create and manage exams
- Add multiple-choice questions
- Set exam duration and marks
- Real-time timer during exam
- Auto-submit on timeout
- One attempt per student per exam

### 📊 Result System
- Automatic scoring
- Grade calculation
- Performance analytics
- Detailed result views
- Export capabilities

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
secure-online-examination-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── attemptCheck.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── exams.js
│   │   ├── questions.js
│   │   └── results.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Timer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   ├── student/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd secure-online-examination-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/secure_exam_system
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:3000

## 📖 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Exam Routes
- `POST /api/exams` - Create exam (Admin only)
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get single exam
- `DELETE /api/exams/:id` - Delete exam (Admin only)

### Question Routes
- `POST /api/questions/:examId` - Add question (Admin only)
- `GET /api/questions/:examId` - Get exam questions

### Result Routes
- `POST /api/results/submit` - Submit exam (Student only)
- `GET /api/results/student` - Get student results (Student only)
- `GET /api/results/exam/:examId` - Get exam results (Admin only)

## 🔒 Security Measures

### Backend Security
- JWT token validation
- Password hashing with bcrypt
- Role-based middleware
- Input validation
- Error handling middleware
- CORS configuration

### Frontend Security
- Protected routes
- Token storage in localStorage
- Auto logout on token expiry
- Role-based component rendering

### Anti-Cheating Features
- Tab switch detection with warnings
- Auto-submit after multiple violations
- Disabled browser back button
- Page refresh prevention
- Timer-based auto-submission

## 👤 Default Users

You can create users through the registration page or use these test accounts:

### Admin Account
- Email: admin@example.com
- Password: admin123
- Role: admin

### Student Account
- Email: student@example.com
- Password: student123
- Role: student

## 🎯 Usage Guide

### For Admins
1. Login with admin credentials
2. Navigate to "Manage Exams"
3. Create a new exam with title, description, duration
4. Add questions with multiple choice options
5. Mark correct answers and assign marks
6. View student results and analytics

### For Students
1. Register or login with student credentials
2. View available exams on dashboard
3. Start an exam (timer begins automatically)
4. Answer questions within time limit
5. Submit exam or wait for auto-submission
6. View results and performance

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure reverse proxy (nginx)
4. Set up SSL certificate

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to static hosting (Netlify, Vercel)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Timer may not sync perfectly across different browser tabs
- Large file uploads not supported for questions
- Real-time notifications not implemented

## 🔮 Future Enhancements

- [ ] Question bank management
- [ ] Bulk question import/export
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Mobile app support
- [ ] Video proctoring
- [ ] Plagiarism detection
- [ ] Multi-language support

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using MERN Stack**