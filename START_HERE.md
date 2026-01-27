# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Install MongoDB

**Option A - Local MongoDB (Recommended for development):**
```bash
# On macOS:
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option B - MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update `server/.env` with your connection string

### Step 2: Seed the Database

```bash
cd server
npm run seed
```

You'll see:
```
✅ Admin user created: admin@akpsi.org / admin123
✅ Pledge user created: pledge@akpsi.org / pledge123
✅ Sample brothers created
✅ Weekly requirements created for Fall 2025
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Should see: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
# From project root
npm run dev
```

Should see: `➜  Local:   http://localhost:3000/`

### Step 4: Open and Test

1. Open browser to http://localhost:3000
2. Login with: **pledge@akpsi.org** / **pledge123**
3. Explore the dashboard!

## What You Can Do Now

### As a Pledge:
- ✅ View your weekly requirements on the dashboard
- ✅ Click "1:1 Tracker" to manage your meetings
- ✅ Add networking and brotherhood 1:1s
- ✅ Track alumni and industry meetings
- ✅ Check off completion steps (Email Sent, 1:1 Completed, Thank You Sent)
- ✅ Monitor your progress against weekly goals

### As an Admin:
- ✅ Login with: **admin@akpsi.org** / **admin123**
- ✅ Manage brother lists
- ✅ Set weekly requirements
- ✅ Monitor pledge progress

## Troubleshooting

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running: `brew services list`
- Or use MongoDB Atlas cloud database

**"Port 5000 already in use"**
- Kill the process: `lsof -ti:5000 | xargs kill`
- Or change PORT in `server/.env`

**Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check console for CORS errors
- Verify `.env` has `VITE_API_URL=http://localhost:5000/api`

## Need Help?

See full documentation in `SETUP.md` or README.md

---

**You're all set! Enjoy tracking your 1:1s! 🎉**

