# 🚀 Netlify Deployment Guide

Your backend is live at: **https://meetgreet.onrender.com** ✅

Now let's deploy the frontend to Netlify!

---

## ✅ Pre-Deployment Checklist (Already Done!)

- ✅ Created `netlify.toml` configuration
- ✅ Removed proxy from `client/package.json`
- ✅ Created API configuration with environment variables
- ✅ Configured axios to use Render backend URL

---

## 🌐 Step-by-Step Netlify Deployment

### Step 1: Commit Your Changes

```bash
cd "Project summy"

# Add all changes
git add .

# Commit
git commit -m "Configure frontend for Netlify deployment"

# Push to GitHub (if not done yet)
git push origin main
```

---

### Step 2: Deploy to Netlify

#### Option A: Via Netlify Dashboard (Recommended)

1. **Go to**: https://app.netlify.com
2. **Sign up/Login** with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **"Deploy with GitHub"**
5. Select your repository: `meetup-network` (or whatever you named it)
6. **Configure build settings**:

```
Base directory:           client
Build command:            npm run build
Publish directory:        client/build
```

7. **Add Environment Variables**:
   - Click **"Show advanced"**
   - Click **"New variable"**
   - Add:
     ```
     REACT_APP_API_URL = https://meetgreet.onrender.com/api
     REACT_APP_SOCKET_URL = https://meetgreet.onrender.com
     ```

8. Click **"Deploy site"**

9. Wait 2-3 minutes for build to complete

10. **Your site is live!** 🎉
    - You'll get a URL like: `https://random-name-123.netlify.app`

---

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from client directory
cd client

# Build the app
npm run build

# Deploy
netlify deploy --prod

# Follow prompts:
# - Create new site
# - Build directory: build
```

---

### Step 3: Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `meetgreet.com`)
4. Follow DNS configuration instructions
5. Netlify auto-provisions SSL certificate

---

### Step 4: Update Backend CORS

**IMPORTANT**: Update your Render backend to allow the Netlify URL!

1. Go to: https://dashboard.render.com
2. Select your `meetgreet` service
3. Go to **Environment** tab
4. Update or add:
   ```
   FRONTEND_URL = https://your-app-name.netlify.app
   ```
   (Replace with your actual Netlify URL)

5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

### Step 5: Test Your Deployment

1. Visit your Netlify URL: `https://your-app.netlify.app`
2. ✅ Landing page loads
3. ✅ Click **Register** → Fill form → Submit
4. ✅ Login with your credentials
5. ✅ Go to **Matches** → See profiles
6. ✅ Swipe right/left → Works!
7. ✅ Check browser console for errors

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or CORS Error

**Solution**: Update FRONTEND_URL in Render
```bash
# In Render dashboard:
FRONTEND_URL = https://your-netlify-url.netlify.app

# Make sure there's no trailing slash!
```

---

### Issue: Build Fails - "Command not found"

**Solution**: Make sure base directory is set to `client`
- Netlify settings → Build & deploy → Edit settings
- Base directory: `client`

---

### Issue: 404 on Refresh

**Solution**: The `netlify.toml` file already handles this with redirects!
- Make sure `netlify.toml` is in project root
- It redirects all paths to index.html

---

### Issue: Environment Variables Not Working

**Solution**: 
1. Check variable names start with `REACT_APP_`
2. Rebuild the site after adding variables:
   - Deploys → Trigger deploy → Deploy site

---

### Issue: "Cannot read properties of undefined"

**Solution**: Clear browser cache and local storage
```javascript
// In browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📊 Verify API Connection

Open browser console (F12) and run:

```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
// Should print: https://meetgreet.onrender.com/api

// Test API connection
fetch('https://meetgreet.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 🔄 Continuous Deployment

**Already configured!** ✅

Every time you push to GitHub:
1. Netlify automatically detects changes
2. Runs build command
3. Deploys new version
4. Updates live site

---

## ⚡ Performance Optimizations

### Enable Netlify Features:

1. **Asset Optimization**
   - Dashboard → Build & deploy → Post processing
   - Enable: Bundle CSS, Minify CSS, Minify JS

2. **Compression**
   - Automatic with Netlify

3. **CDN**
   - Automatic global CDN

---

## 📱 Update Mobile App

Once Netlify is deployed, update mobile app:

```bash
cd mobile

# Create/update .env file
cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=https://meetgreet.onrender.com/api
EXPO_PUBLIC_SOCKET_URL=https://meetgreet.onrender.com
EOF

# Restart Expo
npx expo start --clear
```

---

## ✅ Final Checklist

- [ ] Frontend deployed to Netlify
- [ ] Backend CORS updated with Netlify URL
- [ ] Registration works
- [ ] Login works
- [ ] Matches page shows profiles
- [ ] Chat functionality works (if testing)
- [ ] No console errors
- [ ] Mobile app updated with production URL

---

## 🎉 You're Live!

**Your Stack:**
- 🌐 Frontend: `https://your-app.netlify.app`
- 🔧 Backend: `https://meetgreet.onrender.com`
- 💾 Database: MongoDB Atlas
- 📱 Mobile: Expo (development)

---

## 📈 Next Steps

1. **Custom Domain**: Add your own domain in Netlify
2. **Analytics**: Enable Netlify Analytics
3. **Monitoring**: Set up error tracking (Sentry)
4. **SEO**: Add meta tags and sitemap
5. **Testing**: Share with friends and get feedback!

---

## 🆘 Need Help?

- Netlify Docs: https://docs.netlify.com
- Render Docs: https://render.com/docs
- Check browser console for errors
- Check Render logs: Dashboard → Logs

---

**Congratulations! Your app is now live! 🚀**

