const mongoose = require('mongoose');
const mockDb = require('./mockDb');

let usingMockDb = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    usingMockDb = false;
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.log('Falling back to mock database for development...');
    usingMockDb = true;
    
    // Add some sample data
    const bcrypt = require('bcryptjs');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    mockDb.createUser({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    });
    
    // Create student user
    const studentPassword = await bcrypt.hash('student123', 10);
    mockDb.createUser({
      name: 'Student User',
      email: 'student@example.com',
      password: studentPassword,
      role: 'student'
    });
    
    console.log('Mock database initialized with sample users:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Student: student@example.com / student123');
  }
};

const isMockDb = () => usingMockDb;

module.exports = { connectDB, isMockDb, mockDb };