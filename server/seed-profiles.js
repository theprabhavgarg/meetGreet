require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const dummyProfiles = [
  {
    email: 'sarah.johnson@example.com',
    password: 'password123',
    fullName: 'Sarah Johnson',
    username: 'sarahjohnson',
    phoneNumber: '+1234567801',
    dateOfBirth: new Date('1995-03-15'),
    gender: 'female',
    city: 'San Francisco',
    educationLevel: 'graduate',
    educationInstitute: 'Stanford University',
    currentOrganization: 'Google',
    currentDesignation: 'Senior Product Manager',
    bio: 'Tech enthusiast passionate about building products that make a difference. Love hiking, coffee, and good conversations. Looking to expand my professional network and meet interesting people.',
    primaryObjective: 'networking',
    preferredCities: ['San Francisco', 'San Jose'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'alex.chen@example.com',
    password: 'password123',
    fullName: 'Alex Chen',
    username: 'alexchen',
    phoneNumber: '+1234567802',
    dateOfBirth: new Date('1992-07-22'),
    gender: 'male',
    city: 'San Francisco',
    educationLevel: 'postgraduate',
    educationInstitute: 'MIT',
    currentOrganization: 'Tesla',
    currentDesignation: 'Lead Software Engineer',
    bio: 'Full-stack developer with a passion for AI and clean code. Weekend warrior who enjoys rock climbing and exploring new restaurants. Always up for tech discussions over coffee.',
    primaryObjective: 'networking',
    preferredCities: ['San Francisco', 'Palo Alto'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'emily.rodriguez@example.com',
    password: 'password123',
    fullName: 'Emily Rodriguez',
    username: 'emilyrodriguez',
    phoneNumber: '+1234567803',
    dateOfBirth: new Date('1994-11-08'),
    gender: 'female',
    city: 'San Francisco',
    educationLevel: 'graduate',
    educationInstitute: 'UC Berkeley',
    currentOrganization: 'Airbnb',
    currentDesignation: 'UX Design Lead',
    bio: 'Designer who believes in human-centered design. Love art galleries, yoga, and meaningful conversations. Looking to connect with creative minds and entrepreneurs.',
    primaryObjective: 'casual-hangouts',
    preferredCities: ['San Francisco', 'Oakland'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'michael.kim@example.com',
    password: 'password123',
    fullName: 'Michael Kim',
    username: 'michaelkim',
    phoneNumber: '+1234567804',
    dateOfBirth: new Date('1990-05-30'),
    gender: 'male',
    city: 'San Jose',
    educationLevel: 'graduate',
    educationInstitute: 'Carnegie Mellon',
    currentOrganization: 'Netflix',
    currentDesignation: 'Data Scientist',
    bio: 'Numbers guy who loves finding patterns in chaos. Fitness enthusiast and amateur chef. Always curious about new ideas and perspectives. Let\'s grab coffee!',
    primaryObjective: 'networking',
    preferredCities: ['San Jose', 'San Francisco'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'priya.sharma@example.com',
    password: 'password123',
    fullName: 'Priya Sharma',
    username: 'priyasharma',
    phoneNumber: '+1234567805',
    dateOfBirth: new Date('1993-09-12'),
    gender: 'female',
    city: 'San Francisco',
    educationLevel: 'postgraduate',
    educationInstitute: 'Harvard Business School',
    currentOrganization: 'McKinsey & Company',
    currentDesignation: 'Management Consultant',
    bio: 'Strategy consultant helping companies solve complex problems. Passionate about startups, books, and travel. Looking to connect with fellow professionals and entrepreneurs.',
    primaryObjective: 'networking',
    preferredCities: ['San Francisco'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'david.wilson@example.com',
    password: 'password123',
    fullName: 'David Wilson',
    username: 'davidwilson',
    phoneNumber: '+1234567806',
    dateOfBirth: new Date('1991-12-25'),
    gender: 'male',
    city: 'Palo Alto',
    educationLevel: 'graduate',
    educationInstitute: 'University of California, Berkeley',
    currentOrganization: 'Meta',
    currentDesignation: 'Product Designer',
    bio: 'Creative problem solver who loves turning ideas into reality. Photography enthusiast and coffee snob. Always looking to learn from others and share experiences.',
    primaryObjective: 'chat-connect',
    preferredCities: ['Palo Alto', 'San Francisco'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'jessica.martinez@example.com',
    password: 'password123',
    fullName: 'Jessica Martinez',
    username: 'jessicamartinez',
    phoneNumber: '+1234567807',
    dateOfBirth: new Date('1996-02-18'),
    gender: 'female',
    city: 'San Francisco',
    educationLevel: 'undergraduate',
    educationInstitute: 'Stanford University',
    currentOrganization: 'Salesforce',
    currentDesignation: 'Marketing Manager',
    bio: 'Marketing professional with a creative streak. Love brunches, hiking trails, and good book recommendations. Looking to build genuine friendships with like-minded people.',
    primaryObjective: 'casual-hangouts',
    preferredCities: ['San Francisco', 'Berkeley'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'ryan.patel@example.com',
    password: 'password123',
    fullName: 'Ryan Patel',
    username: 'ryanpatel',
    phoneNumber: '+1234567808',
    dateOfBirth: new Date('1989-08-05'),
    gender: 'male',
    city: 'San Francisco',
    educationLevel: 'postgraduate',
    educationInstitute: 'Wharton School',
    currentOrganization: 'Sequoia Capital',
    currentDesignation: 'Venture Capitalist',
    bio: 'VC looking to connect with founders and innovators. Passionate about technology, startups, and making an impact. Love discussing ideas over coffee or a casual walk.',
    primaryObjective: 'gain-knowledge',
    preferredCities: ['San Francisco', 'Menlo Park'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'olivia.brown@example.com',
    password: 'password123',
    fullName: 'Olivia Brown',
    username: 'oliviabrown',
    phoneNumber: '+1234567809',
    dateOfBirth: new Date('1994-06-14'),
    gender: 'female',
    city: 'Oakland',
    educationLevel: 'graduate',
    educationInstitute: 'Columbia University',
    currentOrganization: 'Stripe',
    currentDesignation: 'Business Development Manager',
    bio: 'BD professional who loves connecting people and ideas. Yoga instructor on weekends. Always interested in hearing new perspectives and building meaningful relationships.',
    primaryObjective: 'networking',
    preferredCities: ['Oakland', 'San Francisco'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  },
  {
    email: 'james.anderson@example.com',
    password: 'password123',
    fullName: 'James Anderson',
    username: 'jamesanderson',
    phoneNumber: '+1234567810',
    dateOfBirth: new Date('1992-04-20'),
    gender: 'male',
    city: 'San Jose',
    educationLevel: 'graduate',
    educationInstitute: 'Georgia Tech',
    currentOrganization: 'Apple',
    currentDesignation: 'iOS Developer',
    bio: 'Mobile dev who loves crafting delightful user experiences. Part-time musician and full-time tech enthusiast. Looking to meet fellow developers and creative professionals.',
    primaryObjective: 'networking',
    preferredCities: ['San Jose', 'Cupertino'],
    isPhoneVerified: true,
    isEmailVerified: true,
    isLinkedInVerified: true,
    isProfileComplete: true,
    isProfileActive: true
  }
];

async function seedProfiles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meetup-network');
    console.log('✅ Connected to MongoDB');

    // Clear existing dummy profiles (optional - comment out if you want to keep existing data)
    // await User.deleteMany({ email: { $regex: '@example.com$' } });
    // console.log('🗑️  Cleared existing dummy profiles');

    // Generate referral codes and hash passwords
    const profilesWithHashedPasswords = await Promise.all(
      dummyProfiles.map(async (profile) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(profile.password, salt);
        
        return {
          ...profile,
          password: hashedPassword,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          matchingScore: {
            locationWeight: Math.floor(Math.random() * 50) + 50,
            personalityWeight: Math.floor(Math.random() * 30) + 20,
            selfAssessmentWeight: Math.floor(Math.random() * 20) + 10,
            totalScore: Math.floor(Math.random() * 100) + 80
          }
        };
      })
    );

    // Insert profiles
    const result = await User.insertMany(profilesWithHashedPasswords);
    console.log(`✅ Successfully added ${result.length} dummy profiles!`);

    // Display created users
    console.log('\n📋 Created Profiles:');
    result.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.email}) - ${user.currentDesignation} at ${user.currentOrganization}`);
    });

    console.log('\n🎉 Seed completed successfully!');
    console.log('💡 You can now login with any of these profiles using password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding profiles:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProfiles();

