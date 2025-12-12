# 🚀 Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install Dependencies (2 min)
```bash
cd "Project summy"
npm install
cd client && npm install && cd ..
```

### Step 2: Configure Environment (1 min)
```bash
# Create .env file in root directory
cat > .env << 'EOF'
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/meetup-network
JWT_SECRET=your-secret-key-change-in-production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
EOF
```

### Step 3: Start MongoDB (30 sec)
```bash
# If you have MongoDB installed locally:
mongod

# OR use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### Step 4: Run the Application (30 sec)
```bash
# Start both frontend and backend:
npm run dev

# The app will open at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Step 5: Create First User (1 min)
1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in registration form
4. Complete profile setup

## 🎯 What You've Got

A complete social networking platform with:

### ✅ User Features
- Triple verification (Phone + Email + LinkedIn)
- Smart matching algorithm
- Swipe interface (like Tinder, but for friends)
- Real-time chat
- Meetup scheduling
- Story wall
- Safety features & SOS button
- Referral system

### ✅ Admin Features
- User management dashboard
- Analytics and insights
- Partner venue management
- SOS alert handling

### ✅ Revenue Features
- Premium subscriptions
- Star purchases
- Bill splitting
- Referral rewards

## 📁 Project Structure

```
Project summy/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & validation
│   └── utils/             # Helper functions
├── client/                 # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/        # All pages
│   │   ├── components/   # Reusable components
│   │   └── context/      # State management
│   └── public/
└── README.md              # Full documentation
```

## 🛠️ Development Commands

```bash
# Install all dependencies
npm run install-all

# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build for production
npm run build
```

## 🎨 Design System

The app uses a beautiful, cohesive design:
- **Canvas**: #FAF8F2 (warm off-white background)
- **Primary**: #F6DFA4 (soft mustard yellow)
- **Secondary**: #D8CCF2 (gentle purple)
- **Accent**: #CFF1D6 (fresh mint green)
- **Text**: #4C4C4C (readable dark gray)

## 🔑 Key Features to Test

1. **Registration Flow**
   - Multi-step verification
   - Profile setup wizard
   - Personality assessment

2. **Matching System**
   - Browse profiles
   - Swipe right/left
   - Super push stars

3. **Chat System**
   - Real-time messaging
   - Subscription management

4. **Meetup Planning**
   - Schedule meetups
   - Rate experiences
   - Safety features

5. **Admin Panel**
   - Go to /admin/login
   - Manage users
   - View analytics

## 📚 Documentation

- **README.md** - Complete feature documentation
- **SETUP.md** - Detailed setup instructions
- **PROJECT_OVERVIEW.md** - Technical architecture
- **API Documentation** - In README.md

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection failed
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud)
- Check MONGODB_URI in .env

### Module not found
```bash
rm -rf node_modules client/node_modules
npm run install-all
```

## 🚢 Ready to Deploy?

See detailed deployment instructions in README.md

For Heroku:
```bash
heroku create your-app-name
git push heroku main
```

For Vercel (frontend):
```bash
cd client
vercel
```

## 🎉 You're All Set!

Your complete social networking platform is ready. Start building your community of verified professionals and friends!

**Important**: This is NOT a dating app - it's for genuine friendships and professional networking.

## 📞 Support

Check the documentation files:
- README.md - Complete guide
- SETUP.md - Detailed setup
- PROJECT_OVERVIEW.md - Technical details

Happy coding! 🚀



