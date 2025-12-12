const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Purchase stars
router.post('/purchase-stars', verifyToken, async (req, res) => {
  try {
    const { quantity, paymentMethod, transactionId } = req.body;
    
    // Calculate amount (example: $1 per star)
    const amount = quantity * 1;
    
    const payment = new Payment({
      user: req.user._id,
      type: 'stars-purchase',
      amount,
      status: 'completed', // In production, verify payment first
      paymentMethod,
      transactionId,
      starsPurchased: quantity
    });
    
    await payment.save();
    
    // Add stars to user
    const user = await User.findById(req.user._id);
    user.purchasedStars += quantity;
    await user.save();
    
    res.json({ 
      message: `Successfully purchased ${quantity} stars`,
      totalStars: user.dailyStars.count + user.purchasedStars,
      payment
    });
  } catch (error) {
    console.error('Purchase stars error:', error);
    res.status(500).json({ error: 'Failed to purchase stars' });
  }
});

// Subscribe to premium
router.post('/subscribe', verifyToken, async (req, res) => {
  try {
    const { plan, paymentMethod, transactionId } = req.body;
    
    // Calculate amount and duration
    let amount, duration;
    
    if (plan === 'premium-monthly') {
      amount = 9.99;
      duration = 30; // days
    } else if (plan === 'premium-yearly') {
      amount = 99.99;
      duration = 365;
    } else {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);
    
    const payment = new Payment({
      user: req.user._id,
      type: 'subscription',
      amount,
      status: 'completed',
      paymentMethod,
      transactionId,
      subscription: {
        plan,
        startDate,
        endDate
      }
    });
    
    await payment.save();
    
    // Update user subscription
    const user = await User.findById(req.user._id);
    user.subscription = {
      type: 'premium',
      startDate,
      expiryDate: endDate
    };
    await user.save();
    
    res.json({ 
      message: 'Subscription activated successfully',
      subscription: user.subscription,
      payment
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Process bill split payment
router.post('/bill-split/:meetupId', verifyToken, async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    
    const payment = new Payment({
      user: req.user._id,
      type: 'bill-split',
      amount,
      status: 'completed',
      paymentMethod,
      transactionId,
      meetup: req.params.meetupId
    });
    
    await payment.save();
    
    res.json({ 
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    console.error('Bill split payment error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Claim referral reward
router.post('/claim-referral-reward', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Count unclaimed referrals
    const unclaimedReferrals = user.referrals.filter(r => !r.rewardClaimed);
    
    if (unclaimedReferrals.length === 0) {
      return res.status(400).json({ error: 'No rewards to claim' });
    }
    
    // Calculate rewards (example: $5 or 20 stars per referral)
    const cashReward = unclaimedReferrals.length * 5;
    const starsReward = unclaimedReferrals.length * 20;
    
    user.referralRewards.cash += cashReward;
    user.referralRewards.stars += starsReward;
    user.purchasedStars += starsReward;
    
    // Mark referrals as claimed
    user.referrals.forEach(r => {
      if (!r.rewardClaimed) {
        r.rewardClaimed = true;
      }
    });
    
    await user.save();
    
    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      type: 'referral-reward',
      amount: cashReward,
      status: 'completed',
      metadata: {
        referralsCount: unclaimedReferrals.length.toString(),
        starsAwarded: starsReward.toString()
      }
    });
    
    await payment.save();
    
    res.json({ 
      message: 'Referral rewards claimed successfully',
      cashReward,
      starsReward,
      totalRewards: user.referralRewards
    });
  } catch (error) {
    console.error('Claim referral reward error:', error);
    res.status(500).json({ error: 'Failed to claim rewards' });
  }
});

// Get payment history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Payment.countDocuments({ user: req.user._id });
    
    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
