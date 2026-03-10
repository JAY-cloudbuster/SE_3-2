# Frontend Deployment on Vercel

## Overview

This document provides step-by-step instructions for deploying the AgriSahayak frontend application on Vercel. The frontend is built using React with Vite as the build tool and is designed to work with the backend API deployed on Render.

## Prerequisites

Before deploying, ensure you have the following:

1. **Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com) if you don't have one.
2. **Git Repository**: The project should be pushed to a Git repository (GitHub, GitLab, or Bitbucket) that Vercel can access.
3. **Backend Deployment**: The backend should already be deployed on Render (as documented in `BACKEND_DEPLOYMENT_RENDER.md`). Note the backend URL for environment configuration.
4. **Node.js**: Ensure the project is compatible with Node.js version 18 or later (check `package.json` for engine requirements).

## Deployment Steps

### Step 1: Connect Repository to Vercel

1. Log in to your Vercel dashboard.
2. Click on "New Project" or "Add New..." > "Project".
3. Import your Git repository containing the frontend code.
4. Vercel will automatically detect it as a Vite project.

### Step 2: Configure Build Settings

Vercel should auto-detect the following settings, but verify them:

- **Framework Preset**: Vite
- **Root Directory**: `frontend/` (if your repo root contains both frontend and backend; otherwise, leave as root if frontend is at root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (Vite's default build output directory)
- **Install Command**: `npm install`

If auto-detection fails, manually set these in the project settings.

### Step 3: Set Environment Variables

The frontend requires environment variables to connect to the backend API:

1. In your Vercel project dashboard, go to "Settings" > "Environment Variables".
2. Add the following variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL (e.g., `https://se32-backend.onrender.com`)
   - **Environment**: `Production` (and optionally `Preview` and `Development` if needed)

**Important**: The `VITE_` prefix is required for Vite to expose the variable to the client-side code.

### Step 4: Deploy

1. Click "Deploy" to start the deployment process.
2. Vercel will build and deploy your application.
3. Once deployed, you'll receive a production URL (e.g., `https://agritech-frontend.vercel.app`).

## Post-Deployment Configuration

### Custom Domain (Optional)

If you have a custom domain:

1. Go to "Settings" > "Domains" in your Vercel project.
2. Add your custom domain and follow the DNS configuration instructions.

### Environment-Specific Builds

- **Production**: Uses the production environment variables.
- **Preview**: Deploys on every push to non-main branches (configure environment variables separately if needed).
- **Development**: For local development, use `.env` files.

## Testing the Deployment

After deployment:

1. Visit the Vercel-provided URL.
2. Test key functionalities:
   - User authentication
   - API calls to backend
   - Real-time features (if applicable)
   - Responsive design

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Vercel dashboard.
   - Ensure all dependencies are listed in `package.json`.
   - Verify Node.js version compatibility.

2. **API Connection Issues**:
   - Confirm `VITE_API_URL` is set correctly.
   - Check CORS settings on the backend.
   - Ensure backend is running and accessible.

3. **Environment Variables Not Working**:
   - Remember the `VITE_` prefix for client-side variables.
   - Redeploy after adding/changing environment variables.

4. **Static Asset Issues**:
   - Ensure assets are in the `public/` directory.
   - Check that build output includes all necessary files.

### Vercel-Specific Tips

- Vercel automatically handles routing for SPAs (Single Page Applications).
- For large builds, consider optimizing bundle size.
- Use Vercel's analytics to monitor performance.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Render Deployment Guide](BACKEND_DEPLOYMENT_RENDER.md)

## Support

If you encounter issues not covered here, check:
- Vercel community forums
- Project issue tracker
- Backend deployment logs on Render