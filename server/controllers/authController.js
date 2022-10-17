const { google } = require('googleapis');

import * as dotenv from 'dotenv';

const oauth = {};

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.YOUR_REDIRECT_URL
);

// Access scopes for user profile info and email
const scopes = ['profile', 'email'];

// Generate a url that asks permissions for the scopes defined above
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  include_granted_scopes: true,
});

// Initiate Connection