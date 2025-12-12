const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendEmailOTP = async (email, otp) => {
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
      to: email,
      subject: 'MeetUp Network - Email Verification',
      html: `
        <div style="font-family: 'Nunito', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAF8F2;">
          <div style="background-color: #F6DFA4; padding: 20px; border-radius: 10px; text-align: center;">
            <h1 style="color: #4C4C4C; margin: 0;">MeetUp Network</h1>
          </div>
          <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 10px;">
            <h2 style="color: #4C4C4C;">Email Verification</h2>
            <p style="color: #4C4C4C; font-size: 16px;">Your verification code is:</p>
            <div style="background-color: #CFF1D6; padding: 20px; border-radius: 5px; text-align: center; font-size: 32px; font-weight: bold; color: #4C4C4C; letter-spacing: 5px;">
              ${otp}
            </div>
            <p style="color: #4C4C4C; font-size: 14px; margin-top: 20px;">This code will expire in 10 minutes.</p>
            <p style="color: #4C4C4C; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Send email OTP error:', error);
    throw error;
  }
};

// Send OTP via SMS
const sendPhoneOTP = async (phoneNumber, otp) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    await client.messages.create({
      body: `Your MeetUp Network verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    return true;
  } catch (error) {
    console.error('Send phone OTP error:', error);
    throw error;
  }
};

// Main function to send OTP
exports.sendOTP = async (destination, type) => {
  const otp = generateOTP();
  
  try {
    if (type === 'email') {
      await sendEmailOTP(destination, otp);
    } else if (type === 'phone') {
      await sendPhoneOTP(destination, otp);
    }
    
    return otp;
  } catch (error) {
    console.error('Send OTP error:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP (simple implementation - in production use Redis)
exports.verifyOTP = (storedOTP, providedOTP) => {
  return storedOTP === providedOTP;
};



