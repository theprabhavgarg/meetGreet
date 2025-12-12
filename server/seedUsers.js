require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const dummyUsers = [
  {
    fullName: 'Sarah Johnson',
    username: 'sarah.j',
    email: 'sarah.johnson@example.com',
    phoneNumber: '+1234567001',
    password: 'password123',
    dateOfBirth: new Date('1995-03-15'),
    gender: 'female',
    city: 'San Francisco',
    currentDesignation: 'Senior Product Manager',
    currentOrganization: 'Google',
    educationLevel: 'graduate',
    educationInstitute: 'Stanford University',
    bio: 'Tech enthusiast who loves hiking on weekends. Always up for a good coffee and conversation about startups!',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'SARAH001'
  },
  {
    fullName: 'Michael Chen',
    username: 'michael.c',
    email: 'michael.chen@example.com',
    phoneNumber: '+1234567002',
    password: 'password123',
    dateOfBirth: new Date('1992-07-22'),
    gender: 'male',
    city: 'New York',
    currentDesignation: 'Software Engineer',
    currentOrganization: 'Meta',
    educationLevel: 'graduate',
    educationInstitute: 'MIT',
    bio: 'Full-stack developer passionate about AI and machine learning. Love exploring new restaurants and tech meetups.',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'MICHAEL002'
  },
  {
    fullName: 'Emily Rodriguez',
    username: 'emily.r',
    email: 'emily.rodriguez@example.com',
    phoneNumber: '+1234567003',
    password: 'password123',
    dateOfBirth: new Date('1994-11-08'),
    gender: 'female',
    city: 'Austin',
    currentDesignation: 'UX Designer',
    currentOrganization: 'Apple',
    educationLevel: 'graduate',
    educationInstitute: 'Rhode Island School of Design',
    bio: 'Design thinking advocate. Love sketching, photography, and finding the best tacos in town!',
    primaryObjective: 'casual-hangouts',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'EMILY003'
  },
  {
    fullName: 'David Kumar',
    username: 'david.k',
    email: 'david.kumar@example.com',
    phoneNumber: '+1234567004',
    password: 'password123',
    dateOfBirth: new Date('1990-05-30'),
    gender: 'male',
    city: 'San Francisco',
    currentDesignation: 'Data Scientist',
    currentOrganization: 'Netflix',
    educationLevel: 'postgraduate',
    educationInstitute: 'UC Berkeley',
    bio: 'Data nerd by day, board game enthusiast by night. Always looking for interesting conversations over coffee.',
    primaryObjective: 'gain-knowledge',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'DAVID004'
  },
  {
    fullName: 'Jessica Taylor',
    username: 'jessica.t',
    email: 'jessica.taylor@example.com',
    phoneNumber: '+1234567005',
    password: 'password123',
    dateOfBirth: new Date('1993-09-12'),
    gender: 'female',
    city: 'Boston',
    currentDesignation: 'Marketing Director',
    currentOrganization: 'HubSpot',
    educationLevel: 'graduate',
    educationInstitute: 'Harvard Business School',
    bio: 'Marketing strategist with a passion for storytelling. Yoga enthusiast and avid reader. Let\'s grab brunch!',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'JESSICA005'
  },
  {
    fullName: 'Alex Patel',
    username: 'alex.p',
    email: 'alex.patel@example.com',
    phoneNumber: '+1234567006',
    password: 'password123',
    dateOfBirth: new Date('1991-12-25'),
    gender: 'male',
    city: 'Seattle',
    currentDesignation: 'DevOps Engineer',
    currentOrganization: 'Amazon',
    educationLevel: 'graduate',
    educationInstitute: 'University of Washington',
    bio: 'Cloud infrastructure expert. Love hiking, craft beer, and attending tech conferences. Open to mentor junior developers!',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'ALEX006'
  },
  {
    fullName: 'Rachel Kim',
    username: 'rachel.k',
    email: 'rachel.kim@example.com',
    phoneNumber: '+1234567007',
    password: 'password123',
    dateOfBirth: new Date('1996-04-18'),
    gender: 'female',
    city: 'Los Angeles',
    currentDesignation: 'Content Strategist',
    currentOrganization: 'Disney',
    educationLevel: 'graduate',
    educationInstitute: 'UCLA',
    bio: 'Storyteller at heart. Love exploring LA\'s hidden gems, trying new cuisines, and weekend adventures!',
    primaryObjective: 'casual-hangouts',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'RACHEL007'
  },
  {
    fullName: 'James Wilson',
    username: 'james.w',
    email: 'james.wilson@example.com',
    phoneNumber: '+1234567008',
    password: 'password123',
    dateOfBirth: new Date('1989-08-07'),
    gender: 'male',
    city: 'Chicago',
    currentDesignation: 'Financial Analyst',
    currentOrganization: 'Goldman Sachs',
    educationLevel: 'postgraduate',
    educationInstitute: 'University of Chicago',
    bio: 'Finance professional with an entrepreneurial spirit. Love deep conversations, jazz music, and trying new restaurants.',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'JAMES008'
  },
  {
    fullName: 'Sophia Martinez',
    username: 'sophia.m',
    email: 'sophia.martinez@example.com',
    phoneNumber: '+1234567009',
    password: 'password123',
    dateOfBirth: new Date('1994-06-14'),
    gender: 'female',
    city: 'Miami',
    currentDesignation: 'Product Designer',
    currentOrganization: 'Airbnb',
    educationLevel: 'graduate',
    educationInstitute: 'Parsons School of Design',
    bio: 'Creative soul passionate about user experience and sustainable design. Beach lover and salsa dancer!',
    primaryObjective: 'chat-connect',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'SOPHIA009'
  },
  {
    fullName: 'Ryan Thompson',
    username: 'ryan.t',
    email: 'ryan.thompson@example.com',
    phoneNumber: '+1234567010',
    password: 'password123',
    dateOfBirth: new Date('1992-10-03'),
    gender: 'male',
    city: 'Denver',
    currentDesignation: 'Sales Manager',
    currentOrganization: 'Salesforce',
    educationLevel: 'graduate',
    educationInstitute: 'University of Colorado',
    bio: 'Sales pro who loves the mountains. Rock climbing, snowboarding, and connecting with interesting people over coffee!',
    primaryObjective: 'networking',
    isProfileComplete: true,
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileActive: true,
    referralCode: 'RYAN010'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meetup-network');
    console.log('📦 Connected to MongoDB');

    // Clear existing dummy users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({ email: { $in: dummyUsers.map(u => u.email) } });
    // console.log('🗑️  Cleared existing dummy users');

    // Check if users already exist
    const existingEmails = await User.find({ 
      email: { $in: dummyUsers.map(u => u.email) } 
    }).select('email');
    
    const existingEmailSet = new Set(existingEmails.map(u => u.email));
    const usersToAdd = dummyUsers.filter(u => !existingEmailSet.has(u.email));

    if (usersToAdd.length === 0) {
      console.log('✅ All dummy users already exist!');
      process.exit(0);
    }

    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      usersToAdd.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    
    console.log(`✅ Successfully added ${usersToAdd.length} dummy users!`);
    console.log('\n📋 Users added:');
    usersToAdd.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.fullName} - ${user.currentDesignation} at ${user.currentOrganization}`);
    });
    
    console.log('\n🔐 Login credentials for all users:');
    console.log('   Password: password123');
    console.log('\n💡 You can now login with any of these emails and see profiles on the Matches page!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();

