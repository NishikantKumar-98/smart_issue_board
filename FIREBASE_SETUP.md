# Firebase Setup Guide

Follow these steps to set up Firebase for your Smart Issue Board application.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `smart-issue-board` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click "Get started"
3. Click on "Email/Password" provider
4. Toggle "Enable" switch
5. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we'll add custom rules)
4. Select your preferred location (choose closest to your users)
5. Click "Enable"

## Step 4: Set Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write issues
    match /issues/{issueId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 5: Get Firebase Configuration

1. In Firebase Console, click on the gear icon ⚙️ (Project Settings)
2. Scroll down to "Your apps" section
3. Click the **Web** icon `</>`
4. Register your app with a nickname (e.g., "Smart Issue Board Web")
5. Copy the `firebaseConfig` object

## Step 6: Configure Environment Variables

1. In your project root, create a file named `.env.local`
2. Add the following variables (replace with your actual values):

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

**Important Security Notes:**
- ✅ `.env.local` is already in `.gitignore` and won't be committed
- ✅ `.env.example` is provided as a template (safe to commit)
- ❌ NEVER commit your actual Firebase credentials to Git
- ✅ For Vercel deployment, add these variables in Vercel dashboard

## Step 7: Test Your Setup

1. Start the development server:
```bash
npm run dev
```

2. Open `http://localhost:5173`
3. Try to sign up with a test account
4. Check Firebase Console → Authentication to see the new user
5. Create a test issue
6. Check Firestore Database to see the new document

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Double-check that Email/Password authentication is enabled
- Verify your `.env.local` file has correct values
- Restart the dev server after adding environment variables

### "Missing or insufficient permissions"
- Ensure Firestore security rules are published
- Make sure you're logged in when trying to access issues
- Check browser console for detailed error messages

### "Firebase: Error (auth/invalid-api-key)"
- Verify `VITE_FIREBASE_API_KEY` in `.env.local`
- Ensure there are no extra spaces or quotes
- API key should start with `AIza`

## Firestore Data Structure

Your `issues` collection will automatically be created when you add the first issue. Each document will have:

```javascript
{
  title: "Example Issue",
  description: "This is a test issue",
  priority: "High",
  status: "Open",
  assignedTo: "user@example.com",
  createdBy: "creator@example.com",
  createdTime: Timestamp,
  updatedTime: Timestamp
}
```

## Next Steps

Once Firebase is configured and working:

1. ✅ Test all authentication flows (sign up, login, logout)
2. ✅ Create several test issues
3. ✅ Test filtering and status transitions
4. ✅ Verify similar issue detection works
5. 🚀 Ready to deploy to Vercel!

## Security Best Practices

### Development
- Use `.env.local` for local development
- Never commit `.env.local` to version control
- Keep your Firebase API key private (though it's safe to use client-side)

### Production
- Add environment variables directly in Vercel dashboard
- Enable App Check for additional security (optional)
- Consider adding more granular Firestore rules for production

### Firestore Rules Enhancement (Optional)

For better security, you can enhance rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issueId} {
      // Anyone authenticated can read
      allow read: if request.auth != null;
      
      // Only creator can delete their own issues
      allow delete: if request.auth != null && 
                      request.auth.token.email == resource.data.createdBy;
      
      // Anyone authenticated can create
      allow create: if request.auth != null &&
                      request.resource.data.createdBy == request.auth.token.email;
      
      // Anyone authenticated can update
      allow update: if request.auth != null;
    }
  }
}
```

This is optional and can be added later for enhanced security.
