# MeetUp Network - Professional Social Networking Platform

A comprehensive platform for professionals and young adults to find meaningful connections, build networks, and arrange casual meetups. **Not a dating app** - focused on genuine friendships and professional relationships.

## 🌟 Features

### Core Features
- **Triple Verification System**: Mobile OTP, Email OTP, and LinkedIn verification
- **Smart Matching Algorithm**: Based on location, personality, and professional interests
- **Profile Browsing**: Swipe right to show interest, left to decline
- **Super Push Stars**: Nudge profiles for better visibility (2 free daily)
- **Real-time Chat**: Message your matches with subscription management
- **Meetup Scheduling**: Plan meetups at verified, recommended venues
- **Post-Meetup Ratings**: Rate users on safety, professionalism, and interaction quality
- **Story Wall**: Share experiences, tag friends, post photos
- **Bill Splitting**: Split bills at app-recommended venues with discounts
- **Referral System**: Earn cash and stars by inviting friends
- **SOS Feature**: Emergency button with location tracking for safety

### Safety Features
- All profiles verified through 3-step authentication
- Safety guidelines at every step
- SOS button with immediate support team notification
- Automatic blocking after 3 safety concerns
- Meet only at app-recommended, safe venues
- Post-meetup rating system

### Revenue Model
- Free chat for 1 month with matches
- Premium subscription for extended chat access
- In-app star purchases for super push features
- Bill splitting with partner venue discounts
- Referral rewards (cash + stars)
- Social media sharing rewards

### Admin Features
- User management (block, suspend, delete)
- Partner venue management
- Analytics dashboard
- SOS escalation handling
- Content moderation
- Notification system

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.IO** for real-time chat
- **JWT** for authentication
- **Cloudinary** for image uploads
- **Twilio** for SMS OTP
- **Nodemailer** for email
- **LinkedIn OAuth** for verification

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Framer Motion** for animations
- **React Icons** for icons

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
cd "Project summy"
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/meetup-network

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/auth/linkedin/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Payment (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**

Development mode (both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Backend
npm run server

# Frontend (in another terminal)
npm run client
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 User Flow

### Section 1: Registration
1. Sign up with email, username, password
2. **Verify phone** via OTP
3. **Verify email** via OTP
4. **Verify LinkedIn** profile
5. Complete profile with:
   - Profile picture
   - Personal details (DOB, city, gender)
   - Education (level, institute)
   - Professional (organization, designation)
   - Bio
6. Answer 10 personality assessment questions
7. Select 5 personality type preferences
8. Choose primary objective (networking, hangouts, chat, knowledge)
9. Select preferred cities and meetup locations

### Section 2: Post-Verification
1. Browse matched profiles (swipe interface)
2. Swipe right to show interest
3. Swipe left to decline (shows again after 15 days)
4. Permanent decline option available
5. Use super push stars (2 free daily)
6. View declined profiles and undo
7. Get notified of super pushes received

### Section 3: Post-Match
1. Chat with matches (free for 1 month)
2. Plan meetups at recommended venues
3. Schedule date and time on app
4. Meet safely at verified locations
5. Rate the experience:
   - Fun to talk to
   - Safety concerns
   - Well spoken
   - Knowledge
   - Professional behavior
6. Automatic blocking after 3 safety concerns

### Section 4: Revenue Features
- Subscribe for unlimited chat access
- Purchase stars for super pushes
- Split bills at partner venues (with discounts)
- Refer friends for rewards (cash + 20 stars)
- Share stories on social media for bonus stars

## 🎨 Design System

### Colors
- **Canvas**: `#FAF8F2` - Off-white background
- **Primary**: `#F6DFA4` - Mustard yellow
- **Secondary**: `#D8CCF2` - Soft purple
- **Accent**: `#CFF1D6` - Mint green
- **Text**: `#4C4C4C` - Dark gray

### Fonts
- **Headings**: Poppins (400, 500, 600, 700)
- **Body**: Nunito (300, 400, 500, 600, 700)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/send-phone-otp` - Send phone OTP
- `POST /api/auth/verify-phone-otp` - Verify phone
- `POST /api/auth/send-email-otp` - Send email OTP
- `POST /api/auth/verify-email-otp` - Verify email
- `POST /api/auth/verify-linkedin` - Verify LinkedIn

### User
- `GET /api/users/profile` - Get own profile
- `PUT /api/users/complete-profile` - Complete profile
- `POST /api/users/personality-assessment` - Save personality answers
- `POST /api/users/personality-preferences` - Save preferences
- `POST /api/users/location-preferences` - Save location prefs
- `GET /api/users/profile/:userId` - Get user profile

### Matching
- `GET /api/matches/potential` - Get potential matches
- `POST /api/matches/swipe-right/:userId` - Show interest
- `POST /api/matches/swipe-left/:userId` - Decline
- `POST /api/matches/super-push/:userId` - Send super push
- `GET /api/matches/my-matches` - Get all matches
- `GET /api/matches/declined` - Get declined profiles
- `POST /api/matches/undo-decline/:userId` - Undo decline

### Chat
- `GET /api/chats` - Get all chats
- `GET /api/chats/:chatId/messages` - Get messages
- `POST /api/chats/:chatId/messages` - Send message

### Meetup
- `GET /api/meetups/venues/recommended` - Get venues
- `POST /api/meetups` - Create meetup
- `POST /api/meetups/:id/confirm` - Confirm meetup
- `POST /api/meetups/:id/rate` - Rate post-meetup
- `POST /api/meetups/:id/split-bill` - Split bill

### Stories
- `POST /api/stories` - Create story
- `GET /api/stories/feed` - Get story feed
- `POST /api/stories/:id/like` - Like story
- `POST /api/stories/:id/comment` - Comment on story
- `POST /api/stories/:id/share` - Share on social media

### Payment
- `POST /api/payments/purchase-stars` - Buy stars
- `POST /api/payments/subscribe` - Subscribe to premium
- `POST /api/payments/claim-referral-reward` - Claim rewards

### SOS
- `POST /api/sos/alert` - Create SOS alert
- `GET /api/sos/my-alerts` - Get user's alerts
- `GET /api/sos/alert/:id` - Get alert status

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get analytics
- `POST /api/admin/partners` - Add partner venue
- `GET /api/admin/partners` - Get partners

## 🔒 Security Features

1. **Triple Verification**: Phone + Email + LinkedIn
2. **JWT Authentication**: Secure token-based auth
3. **Password Hashing**: bcrypt with salt rounds
4. **Rate Limiting**: Prevent abuse
5. **Input Validation**: Server-side validation
6. **Safety Reports**: Track and block unsafe users
7. **SOS System**: Real-time emergency support
8. **Secure Image Upload**: Cloudinary integration

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Build
npm run build

# Set environment variables
# Deploy to your platform
```

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy build folder
```

### Database (MongoDB Atlas)
- Create cluster
- Update MONGODB_URI in .env
- Whitelist IP addresses

## 📈 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Video call integration
- [ ] Group meetups
- [ ] Event hosting
- [ ] AI-powered matching
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Gamification features
- [ ] Professional badges

## 🤝 Contributing

This is a private project. For inquiries, contact the development team.

## 📄 License

Proprietary - All Rights Reserved

## 🆘 Support

For support and queries:
- Email: support@meetupnetwork.com
- Website: www.meetupnetwork.com

---

**Remember**: MeetUp Network is built for genuine friendships and professional connections, not dating. Safety and authenticity are our top priorities.



