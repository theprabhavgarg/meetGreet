# 🚀 Deployment Guide

This guide covers deploying your Meetup Network app to production.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Setup (MongoDB Atlas)](#1-database-setup-mongodb-atlas)
3. [Backend Deployment (Railway/Render)](#2-backend-deployment)
4. [Frontend Deployment (Vercel)](#3-frontend-deployment)
5. [Mobile App Deployment](#4-mobile-app-deployment)
6. [Environment Variables](#5-environment-variables)
7. [Post-Deployment Setup](#6-post-deployment-setup)

---

## Overview

### Architecture
```
┌─────────────────┐
│  React Web App  │ → Deployed on Vercel
└────────┬────────┘
         │
         ↓ API Calls
┌─────────────────┐
│  Node.js API    │ → Deployed on Railway/Render
└────────┬────────┘
         │
         ↓ Database Queries
┌─────────────────┐
│  MongoDB Atlas  │ → Cloud Database
└─────────────────┘

┌─────────────────┐
│ React Native    │ → Deployed via Expo
└─────────────────┘
```

### Estimated Time
- ⏱️ **Total**: ~45 minutes
- Database: 10 min
- Backend: 15 min
- Frontend: 10 min
- Configuration: 10 min

---

## 1. Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free tier - no credit card needed)
3. Create a **Free M0 Cluster**:
   - Cloud Provider: **AWS**
   - Region: Choose closest to you (e.g., `us-east-1`)
   - Cluster Name: `meetup-network`

### Step 2: Create Database User

1. Click **Database Access** (left sidebar)
2. Click **Add New Database User**
   - Username: `meetupuser`
   - Password: **Generate secure password** (save it!)
   - User Privileges: **Read and write to any database**
3. Click **Add User**

### Step 3: Whitelist IP Addresses

1. Click **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click **Confirm**

### Step 4: Get Connection String

1. Click **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string:
   ```
   mongodb+srv://meetupuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `/meetup-network` before the `?`:
   ```
   mongodb+srv://meetupuser:YourPassword123@cluster0.xxxxx.mongodb.net/meetup-network?retryWrites=true&w=majority
   ```

✅ **Save this connection string** - you'll need it!

---

## 2. Backend Deployment

### Option A: Railway (Recommended - Easiest)

#### Step 1: Prepare Backend

1. Create `Procfile` in project root:
```bash
cd "Project summy"
echo "web: node server/index.js" > Procfile
```

2. Make sure `package.json` has start script:
```json
{
  "scripts": {
    "start": "node server/index.js"
  }
}
```

#### Step 2: Deploy to Railway

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository (or create one first - see Git Setup below)
5. Railway will auto-detect Node.js

#### Step 3: Add Environment Variables

In Railway dashboard:
1. Click your project → **Variables** tab
2. Add these variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://meetupuser:password@cluster0.xxxxx.mongodb.net/meetup-network?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long_12345
FRONTEND_URL=https://your-app.vercel.app
```

3. Click **Deploy** (Railway will redeploy automatically)

#### Step 4: Get Backend URL

- Your backend URL will be: `https://your-app-name.up.railway.app`
- Save this URL!

---

### Option B: Render (Alternative - Also Free)

1. Go to: https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your repository
5. Configure:
   - **Name**: `meetup-network-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`
6. Add Environment Variables (same as Railway above)
7. Click **Create Web Service**

Your backend URL: `https://meetup-network-api.onrender.com`

---

### Option C: Heroku (Classic)

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
cd "Project summy"
heroku create meetup-network-api

# Add config vars
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_atlas_connection_string"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set FRONTEND_URL="https://your-app.vercel.app"

# Deploy
git push heroku main
```

---

## 3. Frontend Deployment

### Option A: Vercel (Recommended - Fastest)

#### Step 1: Prepare Frontend

1. Update `client/.env.production`:
```bash
cd client
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_SOCKET_URL=https://your-backend-url.railway.app
EOF
```

2. Update `client/package.json` proxy (remove it for production):
```json
{
  "name": "meetup-network-client",
  // Remove or comment out:
  // "proxy": "http://localhost:5000"
}
```

#### Step 2: Deploy to Vercel

**Method 1: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd client
vercel --prod
```

**Method 2: Using Vercel Website**
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   REACT_APP_SOCKET_URL=https://your-backend-url.railway.app
   ```
7. Click **Deploy**

Your frontend URL: `https://your-app.vercel.app`

---

### Option B: Netlify (Alternative)

1. Go to: https://netlify.com
2. Sign up with GitHub
3. Click **Add new site** → **Import an existing project**
4. Connect to GitHub and select repo
5. Configure:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Add Environment Variables (same as Vercel)
7. Click **Deploy**

---

## 4. Mobile App Deployment

### Expo Build & Publish

#### For Testing (Expo Go)

Your app is already accessible via Expo Go!
```bash
cd mobile
npx expo start --tunnel
```
Share the QR code with testers.

---

#### For Production (App Stores)

**Option 1: Expo Application Services (EAS) - Easiest**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd mobile
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

**Option 2: Manual Build**

For iOS:
- Requires Mac with Xcode
- Apple Developer Account ($99/year)

For Android:
- Google Play Developer Account ($25 one-time)

---

## 5. Environment Variables

### Backend (.env)
```bash
# Production
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/meetup-network
JWT_SECRET=your_super_secret_key_min_32_chars
FRONTEND_URL=https://your-app.vercel.app

# Optional (if you set them up)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
LINKEDIN_REDIRECT_URI=https://your-app.vercel.app/auth/linkedin/callback

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env.production)
```bash
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_SOCKET_URL=https://your-backend.railway.app
```

### Mobile (mobile/.env)
```bash
EXPO_PUBLIC_API_URL=https://your-backend.railway.app/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

---

## 6. Post-Deployment Setup

### Update Backend with Frontend URL

1. Go to Railway/Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Redeploy backend

### Update Frontend with Backend URL

1. In Vercel dashboard → Settings → Environment Variables
2. Update:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```
3. Redeploy frontend

### Seed Production Database

```bash
# SSH into Railway (or use Railway CLI)
railway run node server/seedUsers.js

# Or use Render Shell
# Go to Render dashboard → Shell → run command
node server/seedUsers.js
```

### Test Everything

1. ✅ Visit your frontend URL
2. ✅ Register a new user
3. ✅ Login
4. ✅ Check matches page
5. ✅ Test chat functionality
6. ✅ Test mobile app

---

## 🔒 Security Checklist

Before going live:

- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Use strong MongoDB password
- [ ] Enable CORS only for your domains
- [ ] Set up proper MongoDB IP whitelist (not 0.0.0.0/0)
- [ ] Enable rate limiting (already configured)
- [ ] Set up SSL certificates (automatic with Vercel/Railway)
- [ ] Review and update privacy policy
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy for MongoDB

---

## 📊 Monitoring & Logs

### Railway
- Dashboard → Logs tab
- Real-time logs
- Deployment history

### Vercel
- Dashboard → Deployments → View logs
- Analytics tab for usage stats

### MongoDB Atlas
- Metrics tab for database performance
- Alerts for monitoring

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check logs in Railway/Render dashboard
# Common issues:
- Missing environment variables
- MongoDB connection string incorrect
- PORT not set correctly
```

### Frontend can't connect to backend
```bash
# Check CORS settings in backend
# Verify REACT_APP_API_URL is correct
# Check browser console for errors
```

### Database connection failed
```bash
# Verify MongoDB Atlas connection string
# Check IP whitelist in Atlas
# Verify database user credentials
```

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Start)
- **MongoDB Atlas**: Free M0 cluster (512MB storage)
- **Railway**: $5 credit/month (usually enough for small apps)
- **Vercel**: Free for personal projects
- **Expo**: Free for development & testing

### Paid Tiers (When You Scale)
- **MongoDB Atlas**: $0.08/hr (~$57/mo) for M10
- **Railway**: $0.000463/GB-minute
- **Vercel**: $20/month Pro plan
- **EAS Build**: $29/month for faster builds

---

## 🎉 You're Live!

Once deployed, your app will be accessible at:
- **Web**: `https://your-app.vercel.app`
- **API**: `https://your-backend.railway.app`
- **Mobile**: Via Expo Go or App Stores

Share your app with the world! 🚀

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Tutorial](https://www.mongodb.com/docs/atlas/getting-started/)
- [Expo Deployment](https://docs.expo.dev/distribution/introduction/)

---

**Need help?** Check the logs first, then refer to platform-specific documentation.

