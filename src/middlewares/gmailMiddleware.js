const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const credentials = require('../../credentials.json');
const nodemailer = require('../../node_modules/nodemailer');

// OAuth2 client setup
const oauth2Client = new OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

// Hàm thiết lập refresh token và lấy access token mới
const setAccessTokenWithRefreshToken = async (refreshToken) => {
  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { token } = await oauth2Client.getAccessToken();
    return token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

const sendEmailMiddleware = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log('Received email:', email);

        if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ success: false, message: 'Valid email is required' });
        }

        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (!refreshToken) {
            return res.status(500).json({ success: false, message: 'Server is missing the refresh token' });
        }

        const accessToken = await setAccessTokenWithRefreshToken(refreshToken);
        oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const subject = 'Hotel Registration Confirmation';
        const body = `Dear Hotel Owner,\n\nThank you for registering as a hotel owner. Your registration has been successfully processed.\n\nRegards,\nHotel App Team`;

        const message = `
From: "Stay Finder" <stayfindera@gmail.com>
To: ${email}
Subject: ${subject}

${body}
        `.trim();

        console.log('Raw Message:', message);

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        
        console.log('Encoded Message:', encodedMessage);

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('Email sent successfully:', response.data);
        next();
    } catch (error) {
        console.error('Error sending email:', error);
        const errorMessage = error.response ? error.response.data.error.message : error.message;
        console.error('Detailed error message:', errorMessage);

        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: errorMessage,
        });
    }
};


module.exports = sendEmailMiddleware;
