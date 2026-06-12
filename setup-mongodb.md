# MongoDB Setup Guide

## Option 1: Use MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. Update the `.env` file with your connection string

## Option 2: Install MongoDB Locally

### Windows Installation:
1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Install the MSI file
3. Start MongoDB service:
   ```
   net start MongoDB
   ```

### Alternative: Use MongoDB Compass
1. Download MongoDB Compass (GUI tool)
2. It includes MongoDB server
3. Start the local server

## Option 3: Quick Local Setup (If MongoDB is installed)

1. Create data directory:
   ```
   mkdir C:\data\db
   ```

2. Start MongoDB manually:
   ```
   mongod --dbpath C:\data\db
   ```

## Current Configuration

The application is configured to use:
- Local MongoDB: `mongodb://localhost:27017/secure_exam_system`
- Port: 27017 (default)
- Database: secure_exam_system

## Troubleshooting

If you get connection errors:
1. Make sure MongoDB service is running
2. Check if port 27017 is available
3. Verify the connection string in `.env` file
4. Try restarting the backend server

## Test Connection

Once MongoDB is running, restart the backend server:
```
cd backend
npm run dev
```

You should see: "MongoDB Connected: localhost:27017"