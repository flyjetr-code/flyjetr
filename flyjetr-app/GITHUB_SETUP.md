# GitHub CI/CD Setup Guide

## Required GitHub Secrets

To enable automatic deployment, you need to add these secrets to your GitHub repository:

### 1. Go to GitHub Repository Settings
- Navigate to your repository on GitHub
- Click **Settings** → **Secrets and variables** → **Actions**
- Click **New repository secret** for each secret below

### 2. Firebase Token
**Secret Name**: `FIREBASE_TOKEN`
**Value**: Get this by running:
```bash
firebase login:ci
```
Copy the token and add it as a secret.

### 3. Environment Variables
Add these secrets for the build process:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBi-L5v8oMYNVBjWiEAQ70RHNBJ_c-ZDDU` | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `flyjetr-app.firebaseapp.com` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | `flyjetr-app` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `flyjetr-app.firebasestorage.app` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `784055919827` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | `1:784055919827:web:f2fd8f359f60fe88da2026` | Firebase App ID |

## Workflow Behavior

### Main Branch (main)
- **Triggers**: Push to main branch
- **Action**: Deploys to production Firebase hosting
- **URL**: https://flyjetr-app.web.app

### Pull Requests
- **Triggers**: Open/update pull requests to main
- **Action**: Creates preview deployment
- **URL**: https://flyjetr-app--pr-{number}-{hash}.web.app

### Develop Branch
- **Triggers**: Push to develop branch
- **Action**: Deploys to production (same as main)

## Testing the Workflow

1. **Push to main**: Should trigger production deployment
2. **Create PR**: Should create preview deployment
3. **Check Actions tab**: Monitor deployment status

## Troubleshooting

### Common Issues:
- **Build fails**: Check that all environment variables are set
- **Deploy fails**: Verify FIREBASE_TOKEN is valid
- **Preview not working**: Ensure PR number is available

### Getting Firebase Token:
```bash
# Login to Firebase CLI
firebase login

# Get CI token
firebase login:ci

# Copy the token and add to GitHub secrets
```

## Next Steps

1. Add all secrets to GitHub repository
2. Push code to trigger first deployment
3. Set up custom domain (admin.flyjetr.com)
4. Configure production environment variables
