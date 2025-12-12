# Quick Setup Guide

## Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas)
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- MongoDB URI (local or Atlas)
- Email service credentials (Gmail, SendGrid, etc.)
- Twilio credentials for SMS
- LinkedIn OAuth credentials
- Cloudinary for image uploads
- JWT secret (generate a random string)

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas and update the connection string in `.env`

### 4. Run the Application

**Option A: Run everything together**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Initial Setup Tasks

### Create First Admin User

Use MongoDB Compass or mongo shell:

```javascript
use meetup-network

db.admins.insertOne({
  email: "admin@meetupnetwork.com",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  fullName: "Super Admin",
  role: "super-admin",
  permissions: ["user-management", "partner-management", "analytics", "sos-handling", "content-moderation"],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use this Node.js script (save as `create-admin.js`):

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const Admin = require('./server/models/Admin');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = new Admin({
      email: 'admin@meetupnetwork.com',
      password: hashedPassword,
      fullName: 'Super Admin',
      role: 'super-admin',
      permissions: ['user-management', 'partner-management', 'analytics', 'sos-handling', 'content-moderation'],
      isActive: true
    });
    
    await admin.save();
    console.log('Admin created successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
```

Run it:
```bash
node create-admin.js
```

## Testing the App

### 1. Create a Test User
- Go to http://localhost:3000
- Click "Get Started"
- Fill in registration form
- Note: In development, OTP verifications can be bypassed in the code

### 2. Complete Profile Setup
- Upload profile image
- Fill in all required details
- Answer personality questions
- Set location preferences

### 3. Test Features
- Browse potential matches
- Send messages (chat feature)
- Plan a meetup
- Post a story

### 4. Admin Portal
- Go to http://localhost:3000/admin/login
- Login with admin credentials
- Access user management and analytics

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using Atlas

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

### Cloudinary Upload Issues
- Verify Cloudinary credentials
- Check upload folder permissions
- Ensure file size limits

## Development Tips

### Hot Reload
Both frontend and backend support hot reload in development mode.

### Debug Mode
Add to `.env`:
```
DEBUG=true
NODE_ENV=development
```

### API Testing
Use Postman or Thunder Client:
- Import API endpoints from README
- Set Authorization header: `Bearer YOUR_JWT_TOKEN`

### Database GUI
Use MongoDB Compass for visual database management:
- Connect with your MongoDB URI
- Browse collections
- Run queries

## Production Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production MongoDB
- [ ] Set up email service (SendGrid recommended)
- [ ] Configure Twilio for SMS
- [ ] Set up Cloudinary
- [ ] Configure payment gateway
- [ ] Set up SSL certificates
- [ ] Configure CORS properly
- [ ] Set up monitoring (PM2, New Relic)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Enable rate limiting
- [ ] Configure logging
- [ ] Set up error tracking (Sentry)

## Support

For issues or questions:
- Check documentation in README.md
- Review code comments
- Check console for errors
- Verify all environment variables

## Next Steps

After setup:
1. Customize personality questions
2. Add partner venues
3. Configure payment gateway
4. Set up production environment
5. Test all features thoroughly
6. Deploy to production

Happy coding! 🚀



