#!/bin/bash

# 🚀 Deployment Preparation Script
# Run this before deploying

echo "🔍 Checking deployment readiness..."
echo ""

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized"
    echo "   Run: git init"
else
    echo "✅ Git initialized"
fi

# Check for .env file
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file missing"
    echo "   Create .env file with required variables"
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies not installed"
    echo "   Run: npm install"
fi

# Check if client dependencies exist
if [ -d client/node_modules ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies not installed"
    echo "   Run: cd client && npm install"
fi

# Check for Procfile
if [ -f Procfile ]; then
    echo "✅ Procfile exists"
else
    echo "⚠️  Procfile missing (needed for Railway/Heroku)"
    echo "   Creating Procfile..."
    echo "web: node server/index.js" > Procfile
    echo "✅ Procfile created"
fi

# Check package.json start script
if grep -q '"start".*"node server/index.js"' package.json; then
    echo "✅ Start script configured"
else
    echo "⚠️  Start script needs verification"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create GitHub repository:"
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/yourusername/meetup-network.git"
echo "   git push -u origin main"
echo ""
echo "2. Set up MongoDB Atlas:"
echo "   - Sign up at: https://www.mongodb.com/cloud/atlas/register"
echo "   - Create free cluster"
echo "   - Get connection string"
echo ""
echo "3. Deploy Backend to Railway:"
echo "   - Sign up at: https://railway.app"
echo "   - Connect GitHub repo"
echo "   - Add environment variables"
echo ""
echo "4. Deploy Frontend to Vercel:"
echo "   - Sign up at: https://vercel.com"
echo "   - Import GitHub repo"
echo "   - Set root directory to 'client'"
echo ""
echo "5. See DEPLOYMENT.md for detailed instructions"
echo ""

