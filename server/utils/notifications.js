const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Send SOS alert to support team
exports.sendSOSAlert = async (sos, user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Email to support team
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'support@meetupnetwork.com', // Support team email
      subject: `🚨 SOS Alert - ${sos.urgencyLevel.toUpperCase()}`,
      html: `
        <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #ff4444; color: white; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0;">🚨 SOS ALERT</h1>
            <h2 style="margin: 10px 0 0 0;">Urgency: ${sos.urgencyLevel.toUpperCase()}</h2>
          </div>
          <div style="background-color: #f5f5f5; padding: 20px; margin-top: 20px; border-radius: 10px;">
            <h3>User Information:</h3>
            <p><strong>Name:</strong> ${user.fullName}</p>
            <p><strong>Phone:</strong> ${user.phoneNumber}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            
            <h3>Location:</h3>
            <p>${sos.location.address || 'Address not provided'}</p>
            <p><strong>Coordinates:</strong> ${sos.location.coordinates[1]}, ${sos.location.coordinates[0]}</p>
            <p><a href="https://www.google.com/maps?q=${sos.location.coordinates[1]},${sos.location.coordinates[0]}" target="_blank">View on Google Maps</a></p>
            
            ${sos.description ? `<h3>Description:</h3><p>${sos.description}</p>` : ''}
            
            <h3>Alert ID:</h3>
            <p>${sos._id}</p>
            
            <p style="margin-top: 30px;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    });
    
    // SMS to support team (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.SUPPORT_PHONE_NUMBER) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      await client.messages.create({
        body: `🚨 SOS ALERT - ${sos.urgencyLevel.toUpperCase()}\nUser: ${user.fullName}\nPhone: ${user.phoneNumber}\nLocation: ${sos.location.address || 'See email for details'}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.SUPPORT_PHONE_NUMBER
      });
    }
    
    return true;
  } catch (error) {
    console.error('Send SOS alert error:', error);
    throw error;
  }
};

// Send safety guidelines notification
exports.sendSafetyGuidelines = async (user, context = 'match') => {
  try {
    const guidelines = {
      match: {
        title: '🛡️ Safety Guidelines',
        points: [
          'Always use the app chat - don\'t share your phone number initially',
          'Meet in well-lit and crowded places',
          'Use app-recommended venues when possible',
          'Share meetup details with a friend or family member',
          'Trust your instincts - if something feels off, it probably is',
          'Use the SOS button if you feel unsafe'
        ]
      },
      meetup: {
        title: '🛡️ Before Your Meetup',
        points: [
          'Confirm the venue and time on the app',
          'Share meetup location with someone you trust',
          'Keep your phone charged',
          'Stay in public places',
          'Remember: This is for friendship and networking, not dating',
          'Emergency SOS button is available in your profile'
        ]
      }
    };
    
    const guide = guidelines[context] || guidelines.match;
    
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: guide.title,
      html: `
        <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF8F2;">
          <div style="background-color: #F6DFA4; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #4C4C4C; margin: 0;">${guide.title}</h1>
          </div>
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <p style="color: #4C4C4C;">Hi ${user.fullName},</p>
            <p style="color: #4C4C4C;">Your safety is our top priority. Please keep these guidelines in mind:</p>
            <ul style="color: #4C4C4C; line-height: 1.8;">
              ${guide.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
            <div style="background-color: #CFF1D6; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="color: #4C4C4C; margin: 0;"><strong>Remember:</strong> MeetUp Network is for finding friends and professional connections, not for dating or inappropriate behavior.</p>
            </div>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Send safety guidelines error:', error);
    return false;
  }
};

// Send match notification
exports.sendMatchNotification = async (user, matchedUser) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🎉 You have a new match!',
      html: `
        <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF8F2;">
          <div style="background-color: #D8CCF2; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #4C4C4C; margin: 0;">🎉 It's a Match!</h1>
          </div>
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 10px; text-align: center;">
            <p style="color: #4C4C4C; font-size: 18px;">You matched with <strong>${matchedUser.fullName}</strong>!</p>
            <p style="color: #4C4C4C;">Start chatting now and plan your first meetup.</p>
            <a href="${process.env.FRONTEND_URL}/chats" style="display: inline-block; background-color: #F6DFA4; color: #4C4C4C; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold;">Start Chatting</a>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Send match notification error:', error);
    return false;
  }
};



