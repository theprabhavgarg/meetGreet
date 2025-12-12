# 📱 React Native Mobile App - Complete Setup Guide

## What's Been Done

I've converted your MeetUp Network app to **React Native** for native iOS and Android apps! 🎉

### ✅ Completed Features
- Full project structure with Expo
- Authentication flow (Landing, Login, Register)
- Navigation system (Stack + Bottom Tabs)
- Dashboard with stats
- All main screen placeholders
- Design system with your colors
- API integration ready
- Context-based state management

### 📁 New Structure

```
Project summy/
├── server/              # Backend (unchanged - works for both web & mobile)
├── client/              # Web app (React)
└── mobile/              # NEW - Mobile app (React Native)
    ├── App.tsx
    ├── src/
    │   ├── screens/    # All app screens
    │   ├── navigation/ # Navigation setup
    │   ├── context/    # Auth context
    │   ├── config/     # API config
    │   └── theme/      # Colors & styles
    └── package.json
```

## 🚀 Quick Start (macOS)

### Step 1: Install Node.js (if you haven't)
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

### Step 2: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 3: Install Mobile App Dependencies
```bash
cd "Project summy/mobile"
npm install
```

### Step 4: Start the Backend Server
```bash
# In a NEW terminal, from project root
cd "Project summy"
npm install  # Install backend deps if you haven't
npm run server
```

### Step 5: Configure API URL

Edit `mobile/src/config/api.ts`:

For **iOS Simulator**:
```typescript
export const API_URL = 'http://localhost:5000/api';
```

For **Android Emulator**:
```typescript
export const API_URL = 'http://10.0.2.2:5000/api';
```

For **Physical Device** (iPhone/Android):
```typescript
// First, find your computer's IP:
// Run in terminal: ifconfig | grep "inet " | grep -v 127.0.0.1
// Example output: 192.168.1.100

export const API_URL = 'http://192.168.1.100:5000/api';
```

### Step 6: Start Mobile App
```bash
cd "Project summy/mobile"
npm start
```

### Step 7: Run on Device

A QR code will appear. Choose one option:

**Option A: Physical Device (Easiest)**
1. Install "Expo Go" app from App Store (iOS) or Play Store (Android)
2. Open Expo Go
3. Scan the QR code
4. App will load on your phone!

**Option B: iOS Simulator (Mac only)**
- Press `i` in the terminal

**Option C: Android Emulator**
- Install Android Studio
- Set up Android emulator
- Press `a` in the terminal

## 🎯 What You Can Test Now

### ✅ Working Features:
1. **Landing Page** - Beautiful welcome screen
2. **Registration** - Create account
3. **Login** - Sign in
4. **Dashboard** - Home screen with stats
5. **Navigation** - Bottom tabs work
6. **Profile** - View profile & logout

### 🚧 Placeholder Screens:
- Matches (swipe cards - needs implementation)
- Chat (messaging - needs implementation)
- Meetups (scheduling - needs implementation)
- Stories (wall - needs implementation)
- Profile Setup (wizard - needs full flow)

## 📱 Testing the App

### Test Flow:
1. Open app → Landing page appears
2. Tap "Get Started" → Registration form
3. Fill in details → Create account
4. You'll see Profile Setup screen (simplified for now)
5. Complete setup → Dashboard appears
6. Bottom tabs work (Home, Matches, Chats, Meetups, Stories)
7. Test logout from Profile tab

### Test with Backend:
1. Make sure backend is running (`npm run server` from root)
2. Configure correct API_URL (see Step 5)
3. Register a user → Check MongoDB for new user
4. Login → Receives JWT token
5. Dashboard loads user data

## 🎨 Design System

Same beautiful design as web:
- Canvas: #FAF8F2 (warm background)
- Primary: #F6DFA4 (mustard)
- Secondary: #D8CCF2 (purple)
- Accent: #CFF1D6 (mint)
- Text: #4C4C4C (dark gray)

## 🔧 Next Steps to Complete

### Phase 1: Core Features
- [ ] Swipe card matching UI
- [ ] Real-time chat with Socket.IO
- [ ] Profile setup wizard (all 5 steps)
- [ ] Image picker for profile photos

### Phase 2: Advanced Features
- [ ] Meetup scheduling
- [ ] Story wall with photos
- [ ] Push notifications
- [ ] Location services for SOS
- [ ] Camera integration

### Phase 3: Production
- [ ] Build for App Store (iOS)
- [ ] Build for Play Store (Android)
- [ ] Add crash reporting
- [ ] Add analytics
- [ ] Submit to stores

## 🆘 Troubleshooting

### "Cannot find module 'expo'"
```bash
cd mobile
rm -rf node_modules
npm install
```

### "Unable to connect to server"
1. Check backend is running
2. Verify API_URL in `src/config/api.ts`
3. On physical device, ensure same WiFi network
4. Try your computer's IP instead of localhost

### Metro bundler error
```bash
npm start -- --clear
```

### iOS Simulator won't open
```bash
sudo xcode-select --switch /Applications/Xcode.app
```

## 📊 Development vs Production

### Development (Current)
- Uses Expo Go app
- Fast refresh for instant updates
- Easy testing
- Limited native features

### Production (Future)
- Standalone apps for App Store/Play Store
- Full native features
- Better performance
- Requires build process

## 🎉 Success!

You now have:
✅ **Backend API** - Serves both web and mobile
✅ **Web App** - React web application  
✅ **Mobile App** - React Native iOS & Android app

All three use the same backend API!

## 📞 Need Help?

Check these docs:
- `mobile/README.md` - Complete mobile documentation
- **Expo Docs**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/

---

**Happy Mobile Development! 📱🚀**

Remember: This is for genuine friendships & professional networking, not dating.



