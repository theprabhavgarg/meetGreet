const express = require('express');
const router = express.Router();
const SOS = require('../models/SOS');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin, checkPermission } = require('../middleware/auth');
const { sendSOSAlert } = require('../utils/notifications');

// Create SOS alert
router.post('/alert', verifyToken, async (req, res) => {
  try {
    const { 
      latitude, 
      longitude, 
      address, 
      meetupId, 
      description,
      urgencyLevel 
    } = req.body;
    
    const sos = new SOS({
      user: req.user._id,
      meetup: meetupId,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address
      },
      description,
      urgencyLevel: urgencyLevel || 'high'
    });
    
    await sos.save();
    
    // Notify support team immediately
    const io = req.app.get('io');
    if (io) {
      io.emit('sos-alert', {
        sosId: sos._id,
        userId: req.user._id,
        userName: req.user.fullName,
        location: { latitude, longitude, address },
        urgencyLevel: sos.urgencyLevel
      });
    }
    
    // Send SMS/email to support team
    await sendSOSAlert(sos, req.user);
    
    res.json({ 
      message: 'SOS alert sent to support team',
      sosId: sos._id,
      status: 'pending'
    });
  } catch (error) {
    console.error('Create SOS alert error:', error);
    res.status(500).json({ error: 'Failed to create SOS alert' });
  }
});

// Get user's SOS history
router.get('/my-alerts', verifyToken, async (req, res) => {
  try {
    const alerts = await SOS.find({ user: req.user._id })
      .populate('meetup')
      .sort({ createdAt: -1 });
    
    res.json({ alerts });
  } catch (error) {
    console.error('Get SOS alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS alerts' });
  }
});

// Get SOS alert status
router.get('/alert/:sosId', verifyToken, async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.sosId)
      .populate('user', 'fullName phoneNumber')
      .populate('meetup')
      .populate('assignedTo', 'fullName email');
    
    if (!sos) {
      return res.status(404).json({ error: 'SOS alert not found' });
    }
    
    // Verify user is the creator or admin
    if (sos.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json({ sos });
  } catch (error) {
    console.error('Get SOS alert error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS alert' });
  }
});

// [ADMIN] Get all SOS alerts
router.get('/admin/alerts', verifyAdmin, checkPermission('sos-handling'), async (req, res) => {
  try {
    const { status, urgencyLevel, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (urgencyLevel) {
      query.urgencyLevel = urgencyLevel;
    }
    
    const alerts = await SOS.find(query)
      .populate('user', 'fullName phoneNumber email profileImage')
      .populate('meetup')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await SOS.countDocuments(query);
    
    res.json({
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin SOS alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch SOS alerts' });
  }
});

// [ADMIN] Acknowledge SOS alert
router.post('/admin/alerts/:sosId/acknowledge', verifyAdmin, checkPermission('sos-handling'), async (req, res) => {
  try {
    const sos = await SOS.findById(req.params.sosId);
    
    if (!sos) {
      return res.status(404).json({ error: 'SOS alert not found' });
    }
    
    sos.status = 'acknowledged';
    sos.assignedTo = req.admin._id;
    await sos.save();
    
    res.json({ 
      message: 'SOS alert acknowledged',
      sos 
    });
  } catch (error) {
    console.error('Acknowledge SOS error:', error);
    res.status(500).json({ error: 'Failed to acknowledge SOS alert' });
  }
});

// [ADMIN] Update SOS alert status
router.put('/admin/alerts/:sosId', verifyAdmin, checkPermission('sos-handling'), async (req, res) => {
  try {
    const { status, note, actionsTaken } = req.body;
    
    const sos = await SOS.findById(req.params.sosId);
    
    if (!sos) {
      return res.status(404).json({ error: 'SOS alert not found' });
    }
    
    if (status) {
      sos.status = status;
    }
    
    if (status === 'resolved') {
      sos.resolvedAt = new Date();
    }
    
    if (note) {
      sos.notes.push({
        addedBy: req.admin._id,
        note
      });
    }
    
    if (actionsTaken) {
      sos.actionsTaken = actionsTaken;
    }
    
    await sos.save();
    
    // Notify user
    const io = req.app.get('io');
    if (io) {
      io.emit('sos-update', {
        userId: sos.user,
        sosId: sos._id,
        status: sos.status
      });
    }
    
    res.json({ 
      message: 'SOS alert updated',
      sos 
    });
  } catch (error) {
    console.error('Update SOS error:', error);
    res.status(500).json({ error: 'Failed to update SOS alert' });
  }
});

module.exports = router;



