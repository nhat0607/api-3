const { google } = require('googleapis');
const credentials = require('./credentials.json');

const oauth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Cần để lấy refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'],
});

console.log('Authorize this app by visiting this url:', authUrl);

const code = '4/0AanRRrs3wCiP5FOoHNXbSdqLGO4dzFeH2ZBIRV2MSjwvSQagaAeOA1ie9dyBdTNa6tZH0A'; // Mã từ bước trên

oauth2Client.getToken(code, (err, tokens) => {
  if (err) {
    console.error('Error retrieving access token', err);
    return;
  }
  console.log('Refresh Token:', tokens.refresh_token);
});