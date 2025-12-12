const axios = require('axios');

// LinkedIn OAuth verification
exports.verifyLinkedIn = async (authCode) => {
  try {
    // Step 1: Exchange auth code for access token
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code: authCode,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const accessToken = tokenResponse.data.access_token;
    
    // Step 2: Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // Step 3: Get email (requires separate request)
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const profile = profileResponse.data;
    const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress;
    
    return {
      linkedInId: profile.id,
      firstName: profile.localizedFirstName,
      lastName: profile.localizedLastName,
      email,
      profileUrl: `https://www.linkedin.com/in/${profile.vanityName || profile.id}`
    };
  } catch (error) {
    console.error('LinkedIn verification error:', error);
    throw new Error('LinkedIn verification failed');
  }
};

// Generate LinkedIn OAuth URL
exports.getLinkedInAuthURL = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    scope: 'r_liteprofile r_emailaddress'
  });
  
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
};



