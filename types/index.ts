export interface User {
  _id: string
  email: string
  password: string
  profile: UserProfile
  verification: UserVerification
  preferences: UserPreferences
  stats: UserStats
  subscription: Subscription
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  fullName: string
  firstName?: string
  lastName?: string
  dob: Date
  age: number
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  city: string
  bio: string
  images: string[]
  phoneNumber: string
  
  // Education
  educationLevel: string
  educationInstitute: string
  
  // Professional
  currentOrganization: string
  currentDesignation: string
  
  // Privacy settings
  hideFirstName: boolean
  hideCurrentCompany: boolean
  
  // Relationship status
  relationshipStatus: 'single' | 'in-relationship' | 'married' | 'prefer-not-to-say'
  
  // Interests
  interests: string[]
}

export interface UserVerification {
  mobileVerified: boolean
  mobileOTP?: string
  mobileOTPExpiry?: Date
  
  emailVerified: boolean
  emailOTP?: string
  emailOTPExpiry?: Date
  
  officialEmailVerified: boolean
  officialEmail?: string
  
  linkedInVerified: boolean
  linkedInId?: string
  
  isFullyVerified: boolean
}

export interface UserPreferences {
  primaryObjective: ('networking' | 'casual-hangouts' | 'chat-connect' | 'gain-knowledge')[]
  cities: string[]
  meetupLocations: string[]
  preferredMeetupTimes: string[]
  personalityAnswers: PersonalityAnswer[]
  interestedPersonalityTypes: string[]
  matchScore: number
}

export interface PersonalityAnswer {
  questionId: string
  answer: string
  points: number
}

export interface UserStats {
  totalMatches: number
  totalMeetups: number
  averageRating: number
  ratings: Rating[]
  safetyConcerns: number
  superPushStarsAvailable: number
  superPushStarsUsed: number
  reportsReceived: number
  blocked: boolean
  blockedReason?: string
}

export interface Rating {
  fromUserId: string
  rating: number
  funToTalkTo: number
  safety: number
  wellSpoken: number
  knowledge: number
  professionalBehavior: number
  comment?: string
  createdAt: Date
}

export interface Subscription {
  plan: 'free' | 'premium'
  startDate?: Date
  endDate?: Date
  autoRenew: boolean
}

export interface Match {
  _id: string
  user1Id: string
  user2Id: string
  user1Status: 'interested' | 'super-push' | 'declined' | 'matched'
  user2Status: 'interested' | 'super-push' | 'declined' | 'matched'
  matchScore: number
  isMatched: boolean
  declinedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Chat {
  _id: string
  matchId: string
  participants: string[]
  messages: Message[]
  meetup?: Meetup
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  senderId: string
  content: string
  type: 'text' | 'meetup-request' | 'system'
  timestamp: Date
  read: boolean
}

export interface Meetup {
  location: string
  venueId?: string
  dateTime: Date
  status: 'proposed' | 'confirmed' | 'completed' | 'cancelled'
  proposedBy: string
  confirmedBy?: string
  completedAt?: Date
}

export interface Venue {
  _id: string
  name: string
  type: 'restaurant' | 'cafe' | 'bar' | 'activity-zone'
  address: string
  city: string
  location: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  images: string[]
  description: string
  safetyRating: number
  partnered: boolean
  discountOffered: number
  createdAt: Date
  updatedAt: Date
}

export interface Story {
  _id: string
  userId: string
  content: string
  images: string[]
  taggedUsers: string[]
  likes: string[]
  comments: Comment[]
  visibility: 'public' | 'matches-only'
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  userId: string
  content: string
  timestamp: Date
}

export interface SOSAlert {
  _id: string
  userId: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  description?: string
  status: 'active' | 'resolved' | 'false-alarm'
  assignedTo?: string
  resolvedAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Referral {
  _id: string
  referrerId: string
  referredEmail: string
  referredUserId?: string
  status: 'pending' | 'completed'
  reward: {
    type: 'cash' | 'stars'
    amount: number
    claimed: boolean
  }
  createdAt: Date
  completedAt?: Date
}

export interface Transaction {
  _id: string
  userId: string
  type: 'subscription' | 'stars-purchase' | 'bill-split' | 'referral-reward'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  details?: any
  createdAt: Date
  updatedAt: Date
}

export interface PersonalityQuestion {
  id: string
  question: string
  options: string[]
  category: string
}

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 'pq1',
    question: 'How do you prefer to spend your weekends?',
    options: ['Outdoor adventures', 'Coffee shops & bookstores', 'Social gatherings', 'Relaxing at home'],
    category: 'lifestyle'
  },
  {
    id: 'pq2',
    question: 'What\'s your communication style?',
    options: ['Direct and to the point', 'Thoughtful and detailed', 'Casual and humorous', 'Empathetic and supportive'],
    category: 'communication'
  },
  {
    id: 'pq3',
    question: 'Which describes your work approach?',
    options: ['Strategic planner', 'Creative innovator', 'Team collaborator', 'Independent executor'],
    category: 'professional'
  },
  {
    id: 'pq4',
    question: 'Your ideal evening meetup involves:',
    options: ['Fine dining & wine', 'Casual bites & deep talks', 'Activity-based fun', 'Cultural events'],
    category: 'social'
  },
  {
    id: 'pq5',
    question: 'How do you handle disagreements?',
    options: ['Debate logically', 'Find compromise', 'Avoid conflict', 'Express emotions openly'],
    category: 'conflict'
  },
  {
    id: 'pq6',
    question: 'What energizes you most?',
    options: ['Meeting new people', 'Deep one-on-one conversations', 'Learning new things', 'Achieving goals'],
    category: 'motivation'
  },
  {
    id: 'pq7',
    question: 'Your sense of humor is:',
    options: ['Witty & sarcastic', 'Silly & playful', 'Dry & subtle', 'Observational'],
    category: 'personality'
  },
  {
    id: 'pq8',
    question: 'When making plans, you prefer:',
    options: ['Spontaneous decisions', 'Flexible outlines', 'Detailed itineraries', 'Go with the flow'],
    category: 'planning'
  },
  {
    id: 'pq9',
    question: 'Your conversation topics usually include:',
    options: ['Current events & news', 'Personal experiences', 'Ideas & philosophy', 'Industry & career'],
    category: 'interests'
  },
  {
    id: 'pq10',
    question: 'What matters most in connections?',
    options: ['Intellectual stimulation', 'Emotional support', 'Shared experiences', 'Professional growth'],
    category: 'values'
  }
]

