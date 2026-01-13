# Vercel Deployment Guide

Step-by-step guide to deploy your Smart Issue Board to Vercel.

## Prerequisites

- ✅ Firebase project configured (see FIREBASE_SETUP.md)
- ✅ Application tested locally
- ✅ GitHub account
- ✅ Vercel account (free tier is sufficient)

## Step 1: Prepare for Deployment

### 1.1 Test Local Build

Before deploying, ensure your app builds successfully:

```bash
npm run build
```

If successful, you'll see output like:
```
vite v5.x.x building for production...
✓ built in X seconds
```

### 1.2 Test Production Preview Locally

```bash
npm run preview
```

Visit `http://localhost:4173` and test all features.

## Step 2: Create GitHub Repository

### 2.1 Initialize Git (if not already done)

```bash
git init
```

### 2.2 Create .gitignore (already included)

Verify `.gitignore` includes:
```
.env
.env.local
.env.production.local
.env.development.local
node_modules
dist
```

### 2.3 Commit Your Code

```bash
git add .
git commit -m "Initial commit: Smart Issue Board"
```

### 2.4 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `smart-issue-board`
4. Make it **Public** (required for internship assignment)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2.5 Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-issue-board.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel

### 3.1 Sign Up / Log In to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### 3.2 Import Your Project

1. Click "Add New..." → "Project"
2. Find your `smart-issue-board` repository
3. Click "Import"

### 3.3 Configure Project

**Framework Preset**: Vite (should be auto-detected)

**Root Directory**: `./` (default)

**Build Command**: `npm run build` (default)

**Output Directory**: `dist` (default)

### 3.4 Add Environment Variables

Click on "Environment Variables" and add each variable:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | your-project.firebaseapp.com |
| `VITE_FIREBASE_PROJECT_ID` | your-project-id |
| `VITE_FIREBASE_STORAGE_BUCKET` | your-project.appspot.com |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID |

**Important**: 
- Copy exact values from your `.env.local` file
- Don't include quotes around values
- Make sure variable names start with `VITE_`

### 3.5 Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 1-2 minutes)
3. You'll see "Congratulations!" when done

## Step 4: Update Firebase Configuration

### 4.1 Add Authorized Domain

Your Vercel app will have a URL like: `https://smart-issue-board-xxx.vercel.app`

1. Go to Firebase Console
2. Navigate to **Authentication** → **Settings** → **Authorized domains**
3. Click "Add domain"
4. Enter your Vercel domain: `smart-issue-board-xxx.vercel.app`
5. Click "Add"

## Step 5: Test Deployed Application

Visit your Vercel URL and test all features:

### ✅ Authentication
- [ ] Sign up with new account
- [ ] Log in with existing account
- [ ] See logged-in user email in navbar
- [ ] Logout works

### ✅ Issue Creation
- [ ] Can create new issue
- [ ] Similar issue detection shows warnings
- [ ] Issue appears in list immediately

### ✅ Issue Management
- [ ] Issues display sorted by newest first
- [ ] Can filter by status
- [ ] Can filter by priority
- [ ] Can update status

### ✅ Status Transitions
- [ ] Can move Open → In Progress
- [ ] Can move In Progress → Done
- [ ] CANNOT move Open → Done (shows error)

## Step 6: Final Touches

### 6.1 Custom Domain (Optional)

If you have a custom domain:

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Add custom domain to Firebase authorized domains

### 6.2 Update README

Add your deployment URL to README.md:

```markdown
## Live Demo

🚀 [View Live Application](https://smart-issue-board-xxx.vercel.app)
```

Commit and push:
```bash
git add README.md
git commit -m "Add live demo link"
git push
```

Vercel will automatically redeploy!

## Troubleshooting

### Build Fails on Vercel

**Error**: "Environment variable not found"
- Go to Project Settings → Environment Variables
- Ensure all `VITE_` variables are added
- Redeploy

**Error**: "Build failed with exit code 1"
- Check build logs in Vercel dashboard
- Ensure `npm run build` works locally
- Check for TypeScript errors or ESLint issues

### Authentication Not Working

**Error**: "auth/unauthorized-domain"
- Add your Vercel domain to Firebase authorized domains
- Wait a few minutes for changes to propagate

**Error**: "Firebase configuration not found"
- Verify environment variables are set in Vercel
- Check variable names have `VITE_` prefix
- Redeploy after adding variables

### Firestore Permission Denied

**Error**: "Missing or insufficient permissions"
- Ensure security rules are published in Firebase Console
- Check that rules allow authenticated access
- Verify user is logged in before accessing issues

## Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push
```

Vercel will:
1. Detect the push
2. Build your project
3. Deploy automatically
4. Show preview URL in GitHub commit

## Performance Optimization

### Vercel Analytics (Optional)

1. In Vercel dashboard → Analytics
2. Enable "Web Analytics"
3. Track Core Web Vitals

### Caching

Vercel automatically caches:
- Static assets (images, CSS, JS)
- API responses (configurable)

No additional configuration needed!

## Security Checklist

- [x] `.env.local` not committed to Git
- [x] Environment variables set in Vercel dashboard
- [x] Firebase security rules enabled
- [x] Authorized domains configured
- [x] Public repository (required for assignment)

## Success! 🎉

Your Smart Issue Board is now live and production-ready!

**Share these with your evaluators:**
- 🔗 Live URL: `https://your-app.vercel.app`
- 📦 GitHub Repository: `https://github.com/YOUR_USERNAME/smart-issue-board`
- 📄 README: Comprehensive documentation included

## Next Steps for Internship Review

1. ✅ Test all features on live URL
2. ✅ Share GitHub repository link
3. ✅ Share deployed Vercel URL
4. ✅ Prepare to explain:
   - Why you chose keyword-based similarity matching
   - How status transition rules are enforced
   - Why Firestore structure is flat
   - How security is implemented
   - Scalability considerations

Good luck with your internship! 🚀
