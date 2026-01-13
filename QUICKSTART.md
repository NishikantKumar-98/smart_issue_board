# Quick Start Guide

Get your Smart Issue Board running in under 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- Firebase account (free)
- Text editor (VS Code recommended)

---

## Step 1: Install Dependencies (1 minute)

Already done! Dependencies are installed. If you need to reinstall:

```bash
npm install
```

---

## Step 2: Set Up Firebase (3 minutes)

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name: `smart-issue-board`
4. Click **"Continue"** → **"Create project"**

### 2.2 Enable Authentication

1. In Firebase Console → **Authentication**
2. Click **"Get started"**
3. Enable **"Email/Password"**
4. Click **"Save"**

### 2.3 Create Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Choose **"Production mode"**
4. Select your location
5. Click **"Enable"**

### 2.4 Set Security Rules

1. In Firestore → **Rules** tab
2. Paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### 2.5 Get Firebase Config

1. Firebase Console → ⚙️ **Project Settings**
2. Scroll to **"Your apps"**
3. Click **Web** icon `</>`
4. Register app: `smart-issue-board-web`
5. **Copy the config values**

### 2.6 Create .env.local File

In your project root, create `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIza...your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Replace with your actual values from Firebase!**

---

## Step 3: Run the App (30 seconds)

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Step 4: Test It Out (1 minute)

1. Click **"Sign Up"**
2. Enter email: `test@example.com`
3. Password: `test123`
4. Click **"Sign Up"** → You're in! 🎉

5. Click **"Create New Issue"**
6. Title: `Test Issue`
7. Description: `Testing the app`
8. Priority: `High`
9. Click **"Create Issue"**

10. Issue appears instantly! ✨

---

## ✅ You're Done!

Your Smart Issue Board is now running locally.

### What You Have:

✅ Authentication (Sign Up / Login)
✅ Issue Creation with similarity detection
✅ Real-time issue listing
✅ Status and priority filters
✅ Status transition rules (Open → In Progress → Done)

---

## Next: Deploy to Vercel

When ready to deploy, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

Quick summary:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy! 🚀

---

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
→ Make sure Email/Password auth is enabled in Firebase Console

### "Missing or insufficient permissions"
→ Check Firestore security rules are published

### Environment variables not working
→ Restart dev server after creating `.env.local`

### Still stuck?
See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed troubleshooting

---

## Need Help?

📖 Full documentation:
- [README.md](README.md) - Complete project overview
- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Detailed Firebase setup
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- [TECHNICAL_DECISIONS.md](TECHNICAL_DECISIONS.md) - Design rationale
- [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Feature checklist

---

**Enjoy building with Smart Issue Board!** 🚀
