# 🔗 Google Calendar Sync Setup Guide

## Current Status

The Google Calendar sync button is now functional! However, it requires **Google OAuth credentials** to work.

## Quick Setup (5-10 minutes)

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing):
   - Click "Select a project" → "New Project"
   - Name it: "AKPsi Pledge Dashboard"
   - Click "Create"

3. **Enable Google Calendar API:**
   - In the search bar, type "Google Calendar API"
   - Click "Google Calendar API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: **External**
     - App name: "AKPsi Pledge Dashboard"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Skip for now, click "Save and Continue"
     - Test users: Add your email
     - Click "Save and Continue"
   
5. **Create OAuth Client ID:**
   - Application type: **Web application**
   - Name: "Pledge Dashboard"
   - Authorized JavaScript origins:
     - Add: `http://localhost:3000`
     - Add: `http://localhost:3001` (if your app runs on port 3001)
     - Add: `http://localhost:5173` (Vite default port)
   - Authorized redirect URIs:
     - Add: `http://localhost:3000`
     - Add: `http://localhost:3001` (if your app runs on port 3001)
     - Add: `http://localhost:5173` (Vite default port)
   - **Important:** The redirect URI must match exactly the URL where your app is running
   - Click "Create"

6. **Copy Your Client ID:**
   - You'll see a popup with your Client ID
   - Copy the entire Client ID (looks like: `123456789-abc123def456.apps.googleusercontent.com`)

### Step 2: Add Client ID to Your App

1. **Open your `.env` file** in the project root:
```bash
cd /Users/jeshalpatel/Desktop/pledge-dashbaord
```

2. **Add this line** (replace with your actual Client ID):
```
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Your `.env` file should now look like:
```
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### Step 3: Restart the Frontend

```bash
# Stop the current frontend server (Ctrl+C)
# Then restart it:
npm run dev
```

### Step 4: Test the Sync!

1. **Refresh your browser** at http://localhost:3000
2. **Login** as a pledge
3. **Click "🔗 Sync Google Calendar"**
4. **Authorize** the app when Google asks
5. **See your events!** Your Google Calendar events will now appear

## How It Works

### Before Setup:
- Button shows: "🔗 Sync Google Calendar"
- Clicking opens Google Calendar in a new tab
- Shows sample events only

### After Setup:
- Button shows: "🔗 Sync Google Calendar"
- Click to authorize with Google
- Your actual Google Calendar events sync
- Button changes to: "✓ Synced" (green)
- Click "Synced" to refresh events
- Events are color-coded (Google events are blue)

## Features

### ✅ What Works Now:

1. **OAuth Authentication**
   - Secure Google login
   - Permission request for calendar access
   - Token stored in browser

2. **Event Syncing**
   - Fetches events from your primary calendar
   - Shows next 2 months of events
   - Auto-combines with chapter events

3. **Event Display**
   - Google events have blue left border
   - Shows on interactive calendar
   - Listed in "Upcoming Events"

4. **Controls**
   - "Sync" button to refresh events
   - "Disconnect" to unlink calendar
   - Events persist across page reloads

### 🔒 Security & Privacy:

- ✅ Read-only access to calendar
- ✅ OAuth 2.0 secure authentication
- ✅ Token stored locally in browser
- ✅ You can disconnect anytime
- ✅ No calendar data sent to our servers

## Troubleshooting

### "Failed to connect to Google Calendar"

**Solution:** Make sure:
1. You added the Client ID to `.env`
2. You restarted the frontend server
3. Your Google Cloud project has Calendar API enabled
4. You added your email as a test user in OAuth consent screen

### "Invalid client ID"

**Solution:**
- Double-check the Client ID in `.env`
- Make sure there are no extra spaces
- Format: `VITE_GOOGLE_CLIENT_ID=your-id-here`

### Events not showing

**Solution:**
- Click the "Synced" button to refresh
- Check if you have events in your Google Calendar for the next 2 months
- Make sure the calendar is your "primary" calendar in Google

### "Access blocked" error

**Solution:**
- Add yourself as a test user in Google Cloud Console
- Go to: APIs & Services → OAuth consent screen → Test users
- Add your email address

### "Error 400: redirect_uri_mismatch"

**Solution:**
This means the redirect URI in Google Cloud Console doesn't match where your app is running.

1. **Check what port your app is running on:**
   - Look at your terminal where you ran `npm run dev`
   - It will show something like: `Local: http://localhost:3001/` or `Local: http://localhost:5173/`

2. **Add the correct redirect URI to Google Cloud Console:**
   - Go to: APIs & Services → Credentials
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized redirect URIs", add the exact URL where your app is running:
     - If on port 3001: Add `http://localhost:3001`
     - If on port 5173: Add `http://localhost:5173`
     - If on port 3000: Add `http://localhost:3000`
   - Click "Save"
   - **Important:** The redirect URI must match EXACTLY (including the port number)

3. **Wait a few minutes** for Google's changes to propagate

4. **Try again** - refresh your browser and click "Sync Google Calendar" again

## Without OAuth Setup

If you haven't set up OAuth yet:
- The button will show a helpful message
- It will open Google Calendar in a new tab
- You'll see sample events only
- No personal calendar sync

## Advanced Configuration

### For Production Deployment:

1. **Update Authorized Origins:**
   - Add your production domain: `https://yourdomain.com`

2. **Update Authorized Redirect URIs:**
   - Add: `https://yourdomain.com`

3. **Publish OAuth Consent Screen:**
   - Submit for verification if needed
   - Update from "Testing" to "Production"

### Environment Variables:

```bash
# .env file
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## Next Steps

After setup, you can:
- ✅ Sync calendar automatically
- ✅ Refresh events anytime
- ✅ See all events in one place
- ✅ Disconnect and reconnect as needed

---

**Need help? The setup takes about 5-10 minutes. Follow the steps above to enable full Google Calendar sync!** 🚀

