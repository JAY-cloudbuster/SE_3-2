# Backend Deployment Guide - Render

## Overview

This guide will help you deploy only the backend portion of your AgriTech application to Render. The backend includes Express.js API, MongoDB integration, Socket.io for real-time features, and JWT authentication.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com) if you don't have one
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Database**: You'll need a MongoDB connection string (Atlas recommended)

## Step 1: Prepare Your Repository

### 1.1 Create render.yaml Configuration

A `render.yaml` file has been created in your project root with the following configuration:

```yaml
services:
  - type: web
    name: agrisahayak-backend
    runtime: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        generateValue: true
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CORS_ORIGIN
        sync: false
```

### 1.2 Update CORS Origin for Production

When deploying, you'll need to update the CORS_ORIGIN environment variable to point to your frontend URL. For now, you can set it to your production frontend URL or allow all origins temporarily:

**Option 1: Allow all origins (temporary)**
```javascript
// In server.js, temporarily change:
app.use(cors()); // This allows all origins
```

**Option 2: Set specific production URL**
Set `CORS_ORIGIN` to your production frontend URL in Render environment variables.

## Step 2: Deploy to Render

### 2.1 Connect Your Repository

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select your repository
4. Choose the repository containing your AgriSahayak project

### 2.2 Configure Build Settings

**Build Command:**
```
cd backend && npm install
```

**Start Command:**
```
cd backend && npm start
```

**Runtime:** Node.js (should auto-detect)

### 2.3 Set Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Sets the environment |
| `MONGO_URI` | `mongodb+srv://your-connection-string` | Your MongoDB connection string |
| `JWT_SECRET` | `your-secure-jwt-secret-here` | A secure random string for JWT signing |
| `CORS_ORIGIN` | `https://your-frontend-url.com` | Your production frontend URL |

**Important Security Notes:**
- Never commit your `.env` file to Git
- Use strong, unique secrets for JWT_SECRET
- Ensure your MongoDB connection string has proper IP whitelisting

### 2.4 Deploy

1. Click **"Create Web Service"**
2. Render will start building your application
3. The build process will:
   - Install dependencies (`npm install`)
   - Build the application (if needed)
   - Start the server (`npm start`)

## Step 3: Verify Deployment

### 3.1 Check Logs

- Go to your service dashboard
- Click on **"Logs"** tab
- Look for: `Server running on port [PORT_NUMBER]`

### 3.2 Test API Endpoints

Your API will be available at: `https://your-service-name.onrender.com`

Test basic endpoints:
```bash
# Health check (if you have one)
curl https://your-service-name.onrender.com/api/health

# Or test your auth endpoints
curl https://your-service-name.onrender.com/api/auth/register
```

### 3.3 Update Frontend

Update your frontend's API base URL to point to the Render deployment:

```javascript
// In your frontend API service
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

## Common Issues and Solutions

### Issue 1: Build Fails
**Error:** `npm install` fails
**Solution:**
- Check that all dependencies in `backend/package.json` are correct
- Ensure you're using compatible Node.js versions
- Check build logs for specific error messages

### Issue 2: Server Won't Start
**Error:** Application fails to start
**Solution:**
- Check that `MONGO_URI` is correctly set
- Verify `JWT_SECRET` is provided
- Ensure database is accessible from Render's IP ranges
- Check server logs for specific errors

### Issue 3: CORS Issues
**Error:** Frontend can't connect to backend
**Solution:**
- Update `CORS_ORIGIN` to your frontend's production URL
- Or temporarily allow all origins: `app.use(cors())`

### Issue 4: Database Connection Issues
**Error:** Can't connect to MongoDB
**Solution:**
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs)
- Check connection string format
- Verify database user credentials

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Port for the server (auto-assigned by Render) |
| `NODE_ENV` | Yes | development | Environment mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT token signing |
| `CORS_ORIGIN` | Yes | - | Allowed frontend origin URL |

## Performance Considerations

### Free Tier Limitations
- Render's free tier has:
  - 750 hours/month
  - 512 MB RAM
  - Auto-sleep after 15 minutes of inactivity

### Optimization Tips
1. **Connection Pooling**: Your Mongoose connection already handles this
2. **Caching**: Consider adding Redis for session caching if needed
3. **File Uploads**: The `/uploads` route serves static files - consider cloud storage for production

## Monitoring and Maintenance

### Logs
- View real-time logs in Render dashboard
- Set up log retention and monitoring

### Scaling
- Upgrade to paid plans for more resources
- Consider database optimization for high traffic

### Backups
- Set up automated MongoDB backups in Atlas
- Regular code backups via Git

## Next Steps

1. **Test thoroughly** in production environment
2. **Set up monitoring** (Render provides basic metrics)
3. **Configure domain** if needed
4. **Set up CI/CD** for automatic deployments on code changes
5. **Consider adding health checks** for better monitoring

## Support

If you encounter issues:
1. Check Render's documentation: [docs.render.com](https://docs.render.com)
2. Review build logs in your Render dashboard
3. Check MongoDB Atlas connection logs
4. Ensure all environment variables are set correctly

Your backend should now be successfully deployed to Render! 🚀