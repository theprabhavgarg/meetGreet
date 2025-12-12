const User = require('../models/User');

// Calculate matching score for a user
exports.calculateMatchScore = (user) => {
  let locationWeight = 0;
  let personalityWeight = 0;
  let selfAssessmentWeight = 0;
  
  // Location weight (highest priority)
  locationWeight = user.preferredCities.length * 20 + 
                   user.preferredMeetupLocations.length * 30;
  
  // Personality preferences weight
  personalityWeight = user.personalityPreferences.length * 10;
  
  // Self assessment weight
  selfAssessmentWeight = user.personalityScore || 0;
  
  const totalScore = locationWeight + personalityWeight + selfAssessmentWeight;
  
  return {
    locationWeight,
    personalityWeight,
    selfAssessmentWeight,
    totalScore
  };
};

// Calculate compatibility score between two users
exports.calculateCompatibilityScore = (user1, user2) => {
  let score = 0;
  
  // Location matching (50% weight)
  const commonCities = user1.preferredCities.filter(city => 
    user2.preferredCities.includes(city)
  );
  score += commonCities.length * 25;
  
  // Meetup location matching
  const commonLocations = user1.preferredMeetupLocations.filter(loc1 =>
    user2.preferredMeetupLocations.some(loc2 => 
      loc2.city === loc1.city && 
      loc2.locations.some(l => loc1.locations.includes(l))
    )
  );
  score += commonLocations.length * 25;
  
  // Personality matching (30% weight)
  let personalityMatches = 0;
  
  if (user1.personalityAnswers && user2.personalityAnswers) {
    user1.personalityAnswers.forEach(answer1 => {
      const answer2 = user2.personalityAnswers.find(a => a.questionId === answer1.questionId);
      if (answer2 && answer1.answer === answer2.answer) {
        personalityMatches++;
      }
    });
  }
  
  score += personalityMatches * 3;
  
  // Personality preference matching
  if (user1.personalityPreferences && user2.personalityPreferences) {
    let preferenceMatches = 0;
    
    user1.personalityPreferences.forEach(pref1 => {
      const pref2 = user2.personalityPreferences.find(p => p.questionId === pref1.questionId);
      if (pref2 && pref1.answer === pref2.answer) {
        preferenceMatches++;
      }
    });
    
    score += preferenceMatches * 6;
  }
  
  // Primary objective matching (20% weight)
  if (user1.primaryObjective === user2.primaryObjective) {
    score += 20;
  }
  
  // Rating bonus (users with good ratings get priority)
  const avgRating1 = user1.ratings.totalRatings > 0 
    ? (user1.ratings.funToTalkTo + user1.ratings.wellSpoken + user1.ratings.professionalBehaviour) / 3
    : 3;
  const avgRating2 = user2.ratings.totalRatings > 0
    ? (user2.ratings.funToTalkTo + user2.ratings.wellSpoken + user2.ratings.professionalBehaviour) / 3
    : 3;
  
  score += ((avgRating1 + avgRating2) / 2) * 2;
  
  return Math.min(Math.round(score), 100); // Cap at 100
};

// Find potential matches for a user
exports.findPotentialMatches = async (currentUser, limit = 20) => {
  try {
    // Build query
    const query = {
      _id: { $ne: currentUser._id },
      isProfileActive: true,
      accountStatus: 'active',
      // Exclude already swiped users
      _id: { 
        $nin: [
          ...currentUser.rightSwipes,
          ...currentUser.leftSwipes.map(s => s.user),
          ...currentUser.permanentDeclines,
          ...currentUser.matches
        ]
      }
    };
    
    // Filter by city preference
    if (currentUser.preferredCities.length > 0) {
      query.city = { $in: currentUser.preferredCities };
    }
    
    // Filter by primary objective
    query.primaryObjective = currentUser.primaryObjective;
    
    // Check for declined users that are past 15 days
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
    
    const recentDeclines = currentUser.leftSwipes
      .filter(swipe => swipe.declinedAt > fifteenDaysAgo)
      .map(swipe => swipe.user);
    
    if (recentDeclines.length > 0) {
      query._id = { ...query._id, $nin: [...query._id.$nin, ...recentDeclines] };
    }
    
    // Find potential matches
    let potentialMatches = await User.find(query)
      .select('-password -otpData -rightSwipes -leftSwipes -permanentDeclines')
      .limit(limit * 3); // Get more to sort and filter
    
    // Calculate compatibility scores
    const matchesWithScores = potentialMatches.map(match => {
      const compatibilityScore = exports.calculateCompatibilityScore(currentUser, match);
      
      return {
        user: match,
        compatibilityScore,
        stackingScore: match.matchingScore.totalScore + compatibilityScore + match.safetyScore
      };
    });
    
    // Sort by stacking score (location weight > personality match > self assessment)
    matchesWithScores.sort((a, b) => b.stackingScore - a.stackingScore);
    
    // Return top matches
    return matchesWithScores
      .slice(0, limit)
      .map(m => ({
        ...m.user.toObject(),
        compatibilityScore: m.compatibilityScore
      }));
  } catch (error) {
    console.error('Find potential matches error:', error);
    throw error;
  }
};



