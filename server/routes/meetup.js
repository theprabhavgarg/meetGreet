const express = require('express');
const router = express.Router();
const Meetup = require('../models/Meetup');
const Match = require('../models/Match');
const User = require('../models/User');
const Partner = require('../models/Partner');
const { verifyToken } = require('../middleware/auth');

// Get recommended venues
router.get('/venues/recommended', verifyToken, async (req, res) => {
  try {
    const { city, latitude, longitude } = req.query;
    
    let query = { isActive: true };
    
    if (city) {
      query['address.city'] = city;
    }
    
    let partners = await Partner.find(query).sort({ rating: -1 }).limit(20);
    
    // If coordinates provided, sort by distance
    if (latitude && longitude) {
      partners = await Partner.find(query)
        .near('location', {
          center: [parseFloat(longitude), parseFloat(latitude)],
          maxDistance: 10000 // 10km
        })
        .limit(20);
    }
    
    res.json({ venues: partners });
  } catch (error) {
    console.error('Get recommended venues error:', error);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// Create meetup
router.post('/', verifyToken, async (req, res) => {
  try {
    const { matchId, venue, address, city, scheduledTime, partnerId } = req.body;
    
    const match = await Match.findById(matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Verify user is part of match
    if (match.user1.toString() !== req.user._id.toString() && 
        match.user2.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const otherUserId = match.user1.toString() === req.user._id.toString() 
      ? match.user2 
      : match.user1;
    
    const meetup = new Meetup({
      participants: [req.user._id, otherUserId],
      match: matchId,
      location: {
        venue,
        address,
        city,
        isAppRecommended: !!partnerId,
        partnerId
      },
      scheduledTime: new Date(scheduledTime),
      createdBy: req.user._id,
      confirmedBy: [req.user._id]
    });
    
    await meetup.save();
    
    // Notify other user
    const io = req.app.get('io');
    if (io) {
      io.emit('meetup-proposed', {
        userId: otherUserId,
        meetup: meetup
      });
    }
    
    res.json({ 
      message: 'Meetup created successfully',
      meetup 
    });
  } catch (error) {
    console.error('Create meetup error:', error);
    res.status(500).json({ error: 'Failed to create meetup' });
  }
});

// Confirm meetup
router.post('/:meetupId/confirm', verifyToken, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.meetupId);
    
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    // Verify user is participant
    if (!meetup.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Add to confirmed
    if (!meetup.confirmedBy.includes(req.user._id)) {
      meetup.confirmedBy.push(req.user._id);
      await meetup.save();
    }
    
    res.json({ 
      message: 'Meetup confirmed',
      meetup,
      fullyConfirmed: meetup.confirmedBy.length === meetup.participants.length
    });
  } catch (error) {
    console.error('Confirm meetup error:', error);
    res.status(500).json({ error: 'Failed to confirm meetup' });
  }
});

// Submit post-meetup rating
router.post('/:meetupId/rate', verifyToken, async (req, res) => {
  try {
    const { 
      ratedUserId,
      funToTalkTo, 
      safetyConcerns, 
      wellSpoken, 
      knowledge, 
      professionalBehaviour,
      feedback 
    } = req.body;
    
    const meetup = await Meetup.findById(req.params.meetupId);
    
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    // Verify user is participant
    if (!meetup.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Check if already rated
    const existingRating = meetup.ratings.find(
      r => r.ratedBy.toString() === req.user._id.toString() &&
           r.ratedFor.toString() === ratedUserId
    );
    
    if (existingRating) {
      return res.status(400).json({ error: 'Already rated this user' });
    }
    
    // Add rating
    meetup.ratings.push({
      ratedBy: req.user._id,
      ratedFor: ratedUserId,
      funToTalkTo,
      safetyConcerns,
      wellSpoken,
      knowledge,
      professionalBehaviour,
      feedback
    });
    
    await meetup.save();
    
    // Update rated user's profile scores
    const ratedUser = await User.findById(ratedUserId);
    
    const totalRatings = ratedUser.ratings.totalRatings + 1;
    ratedUser.ratings.funToTalkTo = 
      (ratedUser.ratings.funToTalkTo * ratedUser.ratings.totalRatings + funToTalkTo) / totalRatings;
    ratedUser.ratings.safetyConcerns = 
      (ratedUser.ratings.safetyConcerns * ratedUser.ratings.totalRatings + safetyConcerns) / totalRatings;
    ratedUser.ratings.wellSpoken = 
      (ratedUser.ratings.wellSpoken * ratedUser.ratings.totalRatings + wellSpoken) / totalRatings;
    ratedUser.ratings.knowledge = 
      (ratedUser.ratings.knowledge * ratedUser.ratings.totalRatings + knowledge) / totalRatings;
    ratedUser.ratings.professionalBehaviour = 
      (ratedUser.ratings.professionalBehaviour * ratedUser.ratings.totalRatings + professionalBehaviour) / totalRatings;
    ratedUser.ratings.totalRatings = totalRatings;
    
    // Update safety score
    if (safetyConcerns <= 2) { // Low rating indicates concern
      ratedUser.safetyReports.push({
        reportedBy: req.user._id,
        reason: feedback,
        date: new Date()
      });
      
      // Check for 3 continuous safety concerns
      const recentReports = ratedUser.safetyReports.slice(-3);
      if (recentReports.length === 3) {
        ratedUser.accountStatus = 'blocked';
        ratedUser.blockReason = 'Multiple safety concerns reported';
      }
    }
    
    await ratedUser.save();
    
    // Mark meetup as completed if both rated
    if (meetup.ratings.length === meetup.participants.length * 2 - 2) {
      meetup.status = 'completed';
      await meetup.save();
    }
    
    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get user's meetups
router.get('/my-meetups', verifyToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { participants: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    const meetups = await Meetup.find(query)
      .populate('participants', 'fullName profileImage')
      .populate('match')
      .sort({ scheduledTime: -1 });
    
    res.json({ meetups });
  } catch (error) {
    console.error('Get meetups error:', error);
    res.status(500).json({ error: 'Failed to fetch meetups' });
  }
});

// Cancel meetup
router.delete('/:meetupId', verifyToken, async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.meetupId);
    
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    // Verify user is participant
    if (!meetup.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    meetup.status = 'cancelled';
    await meetup.save();
    
    res.json({ message: 'Meetup cancelled successfully' });
  } catch (error) {
    console.error('Cancel meetup error:', error);
    res.status(500).json({ error: 'Failed to cancel meetup' });
  }
});

// Split bill
router.post('/:meetupId/split-bill', verifyToken, async (req, res) => {
  try {
    const { totalAmount, splits } = req.body;
    
    const meetup = await Meetup.findById(req.params.meetupId);
    
    if (!meetup) {
      return res.status(404).json({ error: 'Meetup not found' });
    }
    
    // Apply discount if app-recommended venue
    let discount = 0;
    if (meetup.location.isAppRecommended && meetup.location.partnerId) {
      const partner = await Partner.findById(meetup.location.partnerId);
      if (partner && partner.discount.isActive) {
        discount = partner.discount.percentage;
      }
    }
    
    meetup.billSplit = {
      totalAmount,
      splits,
      discount
    };
    
    await meetup.save();
    
    res.json({ 
      message: 'Bill split created',
      discount,
      finalAmount: totalAmount * (1 - discount / 100)
    });
  } catch (error) {
    console.error('Split bill error:', error);
    res.status(500).json({ error: 'Failed to split bill' });
  }
});

module.exports = router;
