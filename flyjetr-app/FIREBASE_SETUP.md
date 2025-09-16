# Firebase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "flyjetr-2" (or whatever you prefer)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to you)
5. Click "Done"

### 3. Enable Authentication
1. Click "Authentication" in the left menu
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

### 4. Get Your Config
1. Click the gear icon (Project Settings)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname "flyjetr-web"
5. Copy the config object

### 5. Update Your Config
Replace the placeholder in `src/config/firebase.config.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## URL Structure

### Development
- **Admin:** `http://localhost:5173/`
- **Client:** `http://localhost:5173/client/trip/:tripId`

### Production
- **Admin:** `admin.flyjetr.com/`
- **Client:** `flyjetr.com/client/trip/:tripId`

## Testing Without Firebase

The app works in demo mode without Firebase! You can:
- Test all form interactions
- Navigate between pages
- See the UI/UX flow
- Validate form logic

## Next Steps After Firebase Setup

1. **Test data persistence** - Forms will save to Firestore
2. **Add authentication** - Secure admin access
3. **Deploy to Firebase Hosting** - Go live
4. **Set up custom domain** - admin.flyjetr.com

## Firestore Collections (Auto-created)

The app will automatically create these collections when you start using it:
- `contacts`
- `trips` 
- `flights`
- `passengers`
- `operators`
- `vendors`
- `logs`

No manual setup needed!
