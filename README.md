# AKΨ Pledge Dashboard

A comprehensive full-stack dashboard for Alpha Kappa Psi pledges to track their 1:1 meetings, requirements, and progress throughout the pledging process.

## 🚀 Features

### ✅ Fully Implemented

- **User Authentication**
  - Secure login and signup
  - JWT-based authentication
  - Role-based access (Pledge & Admin)

- **1:1 Tracking System**
  - Brother 1:1s (Networking & Brotherhood)
  - Alumni 1:1s with coffee chat tracking
  - Industry 1:1s for professional networking
  - Checkbox tracking: Email Sent, 1:1 Completed, Thank You Sent

- **Progress Dashboard**
  - Real-time progress visualization
  - Weekly requirements tracking
  - Progress bars for each requirement type
  - Overall statistics

- **Weekly Requirements**
  - Admin-configurable weekly goals
  - Date-based requirement tracking
  - Progress monitoring

- **Paddle Tasks Tracker**
  - Weekly task completion tracking
  - Task 1 & Task 2 checkboxes
  - Notes and documentation

- **Running Todo List**
  - Pledge-specific todo items
  - Admin can create and manage todos for each pledge
  - Pledges can mark tasks as completed
  - Priority levels and categories
  - Due date tracking

- **Google Calendar Integration** ⭐ NEW
  - Sync your personal Google Calendar
  - View all events in one place
  - OAuth 2.0 secure authentication
  - Auto-refresh calendar events
  - See GOOGLE_CALENDAR_SETUP.md for setup

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **react-calendar** - Interactive calendar component
- **@react-oauth/google** - Google OAuth integration
- **Vite** - Build tool
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+) or MongoDB Atlas account

### Installation & Setup

1. **Clone and install dependencies:**
```bash
npm install
cd server && npm install
```

2. **Start MongoDB** (if using local):
```bash
brew services start mongodb-community
```

3. **Seed the database:**
```bash
cd server
npm run seed
```

4. **Start the backend:**
```bash
npm run dev  # Runs on http://localhost:5001
```

5. **Start the frontend** (in a new terminal):
```bash
cd ..
npm run dev  # Runs on http://localhost:3000
```

6. **(Optional) Set up Google Calendar Sync:**
- See [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) for detailed instructions
- Quick: Get OAuth Client ID from Google Cloud Console
- Add `VITE_GOOGLE_CLIENT_ID` to `.env` file
- Takes 5-10 minutes to set up

### Default Credentials
- **Admin:** admin@akpsi.org / admin123
- **Pledge:** pledge@akpsi.org / pledge123

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions, API docs, deployment guide
- [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) - Google Calendar sync setup (5-10 min)
- [TODO_FEATURE_GUIDE.md](./TODO_FEATURE_GUIDE.md) - Todo list feature guide
- [CALENDAR_FEATURE.md](./CALENDAR_FEATURE.md) - Calendar integration guide

## 📁 Project Structure

```
pledge-dashboard/
├── server/              # Backend API
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth middleware
│   └── server.js       # Main server
├── src/                # Frontend React app
│   ├── components/     # Reusable components
│   ├── context/        # React context (Auth)
│   ├── pages/          # Page components
│   ├── utils/          # API client
│   └── App.jsx
└── README.md
```

## 🎯 Usage

### For Pledges:
1. Login to your account
2. View your dashboard to see:
   - Weekly progress summary
   - Running todo list (mark tasks as complete)
   - Calendar with upcoming events
   - Option to sync Google Calendar
3. Navigate to "1:1 Tracker" to:
   - Add and track brother 1:1s (networking/brotherhood)
   - Log alumni and industry meetings
   - Check off completion steps
   - View weekly requirements
   - Update paddle task status

### For Admins:
1. Login with admin account
2. Manage brother lists
3. Set weekly requirements for pledge classes
4. Monitor pledge progress
5. Navigate to "Manage Todos" to:
   - View all todos for all pledges
   - Create new todos and assign to pledges
   - Delete completed or unnecessary todos
   - Track completion status

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for stateless authentication
- Protected API routes
- Role-based access control

## 🚀 Deployment

### Backend
- Deploy to Railway, Heroku, or AWS
- Use MongoDB Atlas for production database
- Set environment variables securely

### Frontend
- Deploy to Vercel or Netlify
- Update `VITE_API_URL` to production backend URL

## 📝 Environment Variables

### Backend (`server/.env`)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/pledge-dashboard
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com  # Optional
```

## 🤝 Contributing

This project is maintained by the GT AKPsi Software Development team.

## 📄 License

Internal use for GT Alpha Kappa Psi chapter.

---

**Built with ❤️ for GT AKPsi**

