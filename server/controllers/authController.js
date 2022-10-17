const { google } = require('googleapis');
const { reduceEachLeadingCommentRange } = require('typescript');

const oauth = {};
console.log('in auth');
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.CALLBACK
);

// Access scopes for user profile info and email
const scopes = ['profile', 'email'];

// Generate a url that asks permissions for the scopes defined above
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});
console.log(authorizeUrl);
// Initiate Connection
oauth.initiateAuth = (req, res, next) => {
  console.log('in here');
  res.redirect(301, );
  return next();
};

oauth.getToken = async (req, res, next) => {
  const code = req.query.code;
  console.log(code);
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens);
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });
  return next();
};

module.exports = oauth;
