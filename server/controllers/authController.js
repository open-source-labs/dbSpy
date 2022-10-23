// const { urlencoded } = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();
// const { reduceEachLeadingCommentRange } = require('typescript');

const oauth = {};

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.GOOGLE_AUTH_CALLBACK
);

// Initiate Connection
oauth.initiateAuth = (req, res, next) => {
  // Generate a url that asks permissions for the scopes defined above
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    include_granted_scopes: true,
  });
  res.redirect(301, authorizeUrl);
};

oauth.getToken = async (req, res, next) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials();
  res.locals.token = tokens;
  await oauth2Client.verifyIdToken(
    {
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
      maxExpiry: tokens.expiry_date,
    },
    (err, ticket) => {
      res.locals.userInfo = {
        id: ticket.payload.sub,
        name: ticket.payload.name,
        email: ticket.payload.email,
        image: ticket.payload.picture,
      };
      return next();
    }
  );
};

export default oauth;
