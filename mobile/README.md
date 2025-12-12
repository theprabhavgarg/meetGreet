# MeetUp Network - Mobile App (React Native)

Native iOS and Android app built with React Native and Expo.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Studio

### Installation

1. **Install Expo CLI globally:**
```bash
npm install -g expo-cli
```

2. **Install dependencies:**
```bash
cd mobile
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API URL
```

4. **Start the development server:**
```bash
npm start
# or
expo start
```

5. **Run on device/simulator:**
- Press `i` for iOS simulator (Mac only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📱 Testing on Physical Device

### Option 1: Expo Go App (Easiest)
1. Install "Expo Go" from App Store (iOS) or Play Store (Android)
2. Start the dev server: `npm start`
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)

### Option 2: Development Build
For features that require native code (camera, location):
```bash
# Build for iOS
eas build --profile development --platform ios

# Build for Android
eas build --profile development --platform android
```

## 🔧 Configuration

### API Connection

**Important:** Update the API_URL in `/src/config/api.ts`:

#### For iOS Simulator:
```typescript
export const API_URL = 'http://localhost:5000/api';
```

#### For Android Emulator:
```typescript
export const API_URL = 'http://10.0.2.2:5000/api';
```

#### For Physical Device:
```typescript
// Find your computer's IP address:
// Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
// Windows: ipconfig
export const API_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

## 📂 Project Structure

```
mobile/
├── App.tsx                      # Main app entry
├── app.json                     # Expo configuration
├── src/
│   ├── config/
│   │   └── api.ts              # API configuration
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Navigation setup
│   ├── screens/
│   │   ├── auth/              # Auth screens
│   │   │   ├── LandingScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ProfileSetupScreen.tsx
│   │   └── main/              # Main app screens
│   │       ├── DashboardScreen.tsx
│   │       ├── MatchesScreen.tsx
│   │       ├── ChatListScreen.tsx
│   │       ├── ChatScreen.tsx
│   │       ├── MeetupsScreen.tsx
│   │       ├── StoriesScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   └── theme/
│       └── colors.ts           # Design system colors
└── assets/                     # Images, fonts, etc.
```

## 🎨 Design System

The app uses the same color scheme as the web version:
- **Canvas**: #FAF8F2
- **Primary (Mustard)**: #F6DFA4
- **Secondary (Purple)**: #D8CCF2
- **Accent (Mint)**: #CFF1D6
- **Text**: #4C4C4C

## ✨ Features Implemented

### ✅ Complete
- Landing page with features
- User registration
- User login
- Dashboard with stats
- Bottom tab navigation
- Profile screen
- Authentication flow
- Design system implementation

### 🚧 To Be Completed
- Swipe cards for matching
- Real-time chat with Socket.IO
- Camera integration for profile pictures
- Location services for SOS
- Push notifications
- Meetup scheduling
- Story wall
- Payment integration

## 📦 Key Dependencies

- **expo**: Development platform
- **react-navigation**: Navigation
- **axios**: API requests
- **@react-native-async-storage/async-storage**: Local storage
- **expo-image-picker**: Camera & photo library
- **expo-location**: Location services
- **expo-notifications**: Push notifications
- **socket.io-client**: Real-time chat

## 🔒 Permissions

The app requests the following permissions:
- **Camera**: Profile pictures, story uploads
- **Photo Library**: Select existing photos
- **Location**: Safety features, nearby venues
- **Notifications**: Match alerts, messages

## 🐛 Troubleshooting

### Cannot connect to API
- Check that backend server is running
- Verify API_URL in `src/config/api.ts`
- On physical device, ensure you're on the same WiFi network
- Check firewall settings

### Metro bundler errors
```bash
# Clear cache and restart
expo start -c
```

### Module resolution errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS Simulator not launching
```bash
# Reset simulator
xcrun simctl erase all
```

## 📱 Building for Production

### iOS (requires Mac)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure project
eas build:configure

# Build for App Store
eas build --platform ios
```

### Android
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build for Play Store
eas build --platform android
```

## 🚀 Publishing

### Submit to App Store
```bash
eas submit --platform ios
```

### Submit to Play Store
```bash
eas submit --platform android
```

## 📊 App Store Requirements

### iOS
- App Store Connect account ($99/year)
- Privacy policy URL
- App icon (1024x1024)
- Screenshots for various device sizes
- App description

### Android
- Google Play Console account ($25 one-time)
- Privacy policy URL
- Feature graphic (1024x500)
- App icon
- Screenshots
- Content rating questionnaire

## 🔐 Environment Variables

Create `.env` file:
```
API_URL=http://YOUR_API_URL:5000
SOCKET_URL=http://YOUR_API_URL:5000
LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

## 📝 Development Commands

```bash
# Start development server
npm start

# Start with cache cleared
npm start -- --clear

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Type check
npx tsc --noEmit
```

## 🎯 Next Steps

1. **Complete remaining features:**
   - Implement swipe card matching
   - Add real-time chat with Socket.IO
   - Integrate camera for photos
   - Add push notifications
   - Implement location services

2. **Test thoroughly:**
   - Test on both iOS and Android
   - Test on different screen sizes
   - Test offline functionality
   - Test push notifications

3. **Prepare for launch:**
   - Create app store assets
   - Write privacy policy
   - Set up app analytics
   - Configure crash reporting
   - Submit for review

## 🆘 Support

For issues specific to mobile development:
- Check Expo documentation: https://docs.expo.dev/
- React Navigation docs: https://reactnavigation.org/
- React Native docs: https://reactnative.dev/

## 📄 License

Proprietary - All Rights Reserved

---

**Remember:** This app is for genuine friendships and professional networking, not dating.



