const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isMockDb, mockDb } = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (isMockDb()) {
      // Mock database logic
      const user = mockDb.findUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = { _id: user._id, id: user._id, role: user.role, name: user.name, email: user.email };
    } else {
      // MongoDB logic
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };