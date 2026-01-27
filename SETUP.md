# AKΨ Pledge Dashboard - Setup Guide

## Overview

This pledge dashboard implements a comprehensive 1:1 tracking system based on your Excel spreadsheet requirements. It includes:

- ✅ Brother 1:1s Tracker (Networking & Brotherhood)
- ✅ Alumni 1:1s Tracker
- ✅ Industry 1:1s Tracker
- ✅ Weekly Requirements Dashboard
- ✅ Paddle Tasks Tracker
- ✅ Progress Tracking & Analytics
- ✅ User Authentication (Pledge & Admin roles)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas

## Quick Start

### 1. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB and start the service
# On macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# MongoDB will run on mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `server/.env` with your connection string

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies (already done)
npm install

# The server is already configured with .env file:
# - PORT=5000
# - MONGODB_URI=mongodb://localhost:27017/pledge-dashboard
# - JWT_SECRET=akpsi_pledge_dashboard_secret_key_2025

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

**Seed Data Credentials:**
- **Admin:** admin@akpsi.org / admin123
- **Pledge:** pledge@akpsi.org / pledge123

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies (already done)
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Using the Application

### For Pledges:

1. **Login** at `http://localhost:3000/login`
   - Use: `pledge@akpsi.org` / `pledge123`

2. **Dashboard** - View your weekly progress and requirements

3. **1:1 Tracker** - Track all your 1:1 meetings:
   - **Brother 1:1s Tab**: 
     - Track networking and brotherhood 1:1s
     - Check off: Email Sent, 1:1 Completed, Thank You Sent
     - Add new 1:1s from the brother list or manually
   
   - **Alumni 1:1s Tab**:
     - Track alumni coffee chats
     - Record meeting dates
     - Mark completion status
   
   - **Industry 1:1s Tab**:
     - Similar to Alumni 1:1s
     - Track professional networking
   
   - **Weekly Tracker Tab**:
     - View weekly requirements set by admin
     - See due dates and targets
   
   - **Paddle Tasks Tab**:
     - Track paddle task completion
     - Mark Task 1 and Task 2 as complete
     - Add notes

### For Admins:

1. **Login** with admin credentials
2. **Manage Brothers** - Add/edit brothers for 1:1 tracking
3. **Set Weekly Requirements** - Configure weekly goals for pledges
4. **Monitor Progress** - View pledge completion rates

## Project Structure

```
pledge-dashboard/
├── server/                      # Backend (Express + MongoDB)
│   ├── models/                  # Database models
│   │   ├── User.js             # User accounts (pledge/admin)
│   │   ├── Brother.js          # Brothers list
│   │   ├── OneOnOne.js         # 1:1 meeting records
│   │   ├── WeeklyRequirement.js # Weekly goals
│   │   └── PaddleTask.js       # Paddle task tracker
│   ├── routes/                  # API endpoints
│   │   ├── auth.js             # Authentication
│   │   ├── brothers.js         # Brother management
│   │   ├── oneOnOnes.js        # 1:1 tracking
│   │   ├── weeklyRequirements.js
│   │   └── paddleTasks.js
│   ├── middleware/             # Auth middleware
│   ├── server.js               # Main server file
│   ├── seed.js                 # Database seeder
│   └── package.json
│
├── src/                         # Frontend (React)
│   ├── components/
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   └── OneOnOneTracker.jsx # 1:1 tracker page
│   ├── utils/
│   │   └── api.js              # API client
│   ├── App.jsx
│   └── main.jsx
│
└── package.json                # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Brothers
- `GET /api/brothers` - Get all brothers
- `POST /api/brothers` - Add brother (admin only)
- `PUT /api/brothers/:id` - Update brother (admin only)
- `DELETE /api/brothers/:id` - Delete brother (admin only)

### 1:1 Tracking
- `GET /api/one-on-ones` - Get all 1:1s for current user
- `GET /api/one-on-ones/stats` - Get progress statistics
- `POST /api/one-on-ones` - Create new 1:1
- `PUT /api/one-on-ones/:id` - Update 1:1
- `DELETE /api/one-on-ones/:id` - Delete 1:1

### Weekly Requirements
- `GET /api/weekly-requirements` - Get all requirements
- `GET /api/weekly-requirements/current` - Get current week
- `POST /api/weekly-requirements` - Create requirement (admin)
- `PUT /api/weekly-requirements/:id` - Update requirement (admin)

### Paddle Tasks
- `GET /api/paddle-tasks` - Get all tasks for current user
- `GET /api/paddle-tasks/week/:date` - Get task for specific week
- `POST /api/paddle-tasks` - Create or update task
- `PUT /api/paddle-tasks/:id` - Update task

## Features Implemented

### ✅ Completed Features

1. **Authentication System**
   - JWT-based authentication
   - Protected routes
   - Admin and pledge roles

2. **Brother 1:1s Tracker**
   - Networking and Brotherhood categories
   - Checkbox tracking: Email Sent, 1:1 Completed, Thank You Sent
   - Add from brother list or manually

3. **Alumni & Industry 1:1s**
   - Contact name and date tracking
   - Coffee chat completion
   - Thank you status

4. **Weekly Requirements**
   - Admin-configurable weekly goals
   - Progress tracking per requirement type
   - Visual progress bars

5. **Paddle Tasks Tracker**
   - Weekly task completion tracking
   - Task 1 and Task 2 checkboxes
   - Notes field

6. **Dashboard**
   - Overview of current week's requirements
   - Progress visualization
   - Overall statistics

### 🚧 Future Enhancements (Optional)

- Event calendar integration
- Email notifications
- File upload for paddle tasks
- Advanced reporting and analytics
- Mobile app version
- Integration with Google Calendar

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify `.env` file exists in server folder

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check `.env` file in root has `VITE_API_URL=http://localhost:5000/api`
- Clear browser cache and restart frontend

### Database issues
- Run `npm run seed` to reset and populate database
- Check MongoDB connection string in `server/.env`

## Production Deployment

### Backend (Recommended: Railway, Heroku, or AWS)
1. Set environment variables
2. Use MongoDB Atlas for database
3. Update `JWT_SECRET` to a secure value
4. Configure CORS for your frontend domain

### Frontend (Recommended: Vercel or Netlify)
1. Build: `npm run build`
2. Set `VITE_API_URL` to your backend URL
3. Deploy dist folder

## Support

For issues or questions, contact the AKPsi Software Development team.

---

Built with ❤️ for GT AKPsi

