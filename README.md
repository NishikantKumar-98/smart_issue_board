# Smart Issue Board

A production-ready issue tracking system built with React and Firebase as part of an internship assignment.

## Features

- **Authentication**: Email/password authentication with Firebase Auth
- **Issue Management**: Create, view, and manage issues with status transitions
- **Similar Issue Detection**: Keyword-based detection during issue creation
- **Filtering & Sorting**: Filter by status and priority, sorted by newest first
- **Status Transition Rules**: Enforces Open → In Progress → Done flow
- **Real-time Updates**: Live synchronization with Firestore

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase (Serverless)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **Code Hosting**: GitHub

## Firestore Data Model

### Issues Collection

Each document in the `issues` collection has the following structure:

```javascript
{
  title: string,              // Issue title
  description: string,        // Detailed description
  priority: enum,             // "Low" | "Medium" | "High"
  status: enum,               // "Open" | "In Progress" | "Done"
  assignedTo: string,         // Email or name of assignee
  createdBy: string,          // Email of creator (auto-populated)
  createdTime: timestamp,     // Firestore server timestamp
  updatedTime: timestamp      // Firestore server timestamp
}
```

**Design Decisions**:
- Flat structure for simple queries and filtering
- Server timestamps for consistency
- Indexed fields (status, priority) for efficient filtering
- createdBy field for user-specific queries if needed later

## Key Implementation Details

### 1. Similar Issue Detection

**Approach**: Keyword-based matching
- Split the issue title into words (3+ characters)
- Search existing issues for titles containing any of these keywords
- Display warning with up to 3 similar issues
- Allow user to proceed or cancel

**Justification**: Simple, fast, and explainable. Works well for most common cases without requiring external libraries or complex algorithms.

### 2. Status Transition Rule

**Enforcement**: UI validation with clear error messaging
- When changing status, validate: `Open → Done` is blocked
- Show error: "Cannot move directly from Open to Done. Please set to In Progress first."
- Allow: `Open → In Progress`, `In Progress → Done`, and backward transitions

**Justification**: UI enforcement provides immediate feedback. Can be supplemented with Firestore security rules for backend validation.

### 3. Security Rules

**Firestore Rules** (to be set in Firebase Console):

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

**Justification**: Simple rule ensuring only authenticated users can access issues. Can be extended later for user-specific permissions.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Smart_Issue_Board
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database**
4. Copy your Firebase config from Project Settings

### 4. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important**: Never commit `.env.local` to version control.

### 5. Set Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste:

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

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Issue Board"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard (same as `.env.local`)
4. Deploy

### 3. Verify Deployment

Test all features on the deployed URL:[https://smart-issue-board-iota.vercel.app]
- Sign up / Login
- Create issue (with similarity detection)
- Filter by status and priority
- Update status (validate transition rules)

## Usage Guide

### Creating an Issue

1. Click "Create New Issue"
2. Enter title, description, priority, and assignee
3. If similar issues exist, a warning will appear
4. Click "Create Issue" to proceed or "Cancel" to abort

### Viewing Issues

- All issues are displayed in a table sorted by creation time (newest first)
- Click on a status badge to update the issue status
- Attempting to move from Open to Done shows an error

### Filtering Issues

Use the dropdown filters to:
- Filter by Status: Open, In Progress, Done
- Filter by Priority: Low, Medium, High

## Design Decisions & Justifications

### Why Vite over Create React App?
- Faster development server and build times
- Modern tooling with better developer experience
- Official React team recommendation

### Why Keyword Matching for Similarity?
- Simple to implement and explain
- No external dependencies
- Works well for most use cases
- Easy to debug and extend

### Why UI-level Status Validation?
- Immediate user feedback
- Better UX than backend-only validation
- Can be supplemented with Firestore rules for security

### Why Flat Firestore Structure?
- Easier to query and filter
- Better performance for simple use cases
- Aligns with Firestore best practices for this scale

### Why Tailwind CSS?
- Rapid development without writing custom CSS
- Consistent design system
- Small bundle size with purging
- Easy to customize

## Future Enhancements (Out of Scope)

- User assignment from a dropdown of registered users
- Comments and activity log
- Email notifications
- Advanced search with full-text indexing
- Export issues to CSV
- Multi-team support with team-based permissions

## License

This project is created for internship evaluation purposes.
