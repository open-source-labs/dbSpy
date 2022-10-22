// const { urlencoded } = require('express');
// const { google } = require('googleapis');
// const { reduceEachLeadingCommentRange } = require('typescript');

// const oauth = {};
// console.log('in auth');
// const oauth2Client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.CALLBACK
// );

// // Access scopes for user profile info and email
// const scopes = ['profile', 'email'];

// // Generate a url that asks permissions for the scopes defined above
// const authorizeUrl = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes,
//   include_granted_scopes: true,
// });
// console.log(authorizeUrl);
// // Initiate Connection
// oauth.initiateAuth = (req, res, next) => {
//   console.log('in here');
//   res.redirect(301, authorizeUrl);
//   // return next();
// };

// oauth.getToken = async (req, res, next) => {
//   const code = req.query.code;
//   console.log(code);
//   const { tokens } = await oauth2Client.getToken(code);
//   console.log(tokens);
//   console.log('yooooo');
//   oauth2Client.setCredentials();
//   oauth2Client.on('tokens', (tokens) => {
//     if (tokens.refresh_token) {
//       console.log(tokens.refresh_token);
//     }
//     console.log(tokens.access_token);
//   });
//   res.locals.token = tokens;
//   const ticket = await oauth2Client.verifyIdToken({
//     idToken: tokens.id_token,
//     audience: process.env.CLIENT_ID,
//     maxExpiry: tokens.expiry_date,
//   });
//   try {
//     const payload = await ticket.getPayload();
//     res.locals.userInfo = {
//       id: payload.sub,
//       name: payload.name,
//       email: payload.email,
//       image: payload.picture,
//     };
//   } catch (error) {
//     return next({
//       log: 'oauth.getToken ERROR: could not getPayload',
//       status: 500,
//       message: { err: error },
//     });
//   } finally {
//     return next();
//   }
// };

// // oauth.handleUser = () => {
// //   // if there is a refresh_token in the returned token object, it's the first time a user is
// //   // authenticating --> Create a user
// //   if (tokens.refresh_token) {
// //   }
// // };

// const { urlencoded } = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();
// const { reduceEachLeadingCommentRange } = require('typescript');

const oauth = {};

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

// Initiate Connection
oauth.initiateAuth = (req, res, next) => {
  res.redirect(301, authorizeUrl);
};

oauth.getToken = async (req, res, next) => {
  const code = req.query.code;
  // console.log(code);
  const { tokens } = await oauth2Client.getToken(code);
  // console.log(tokens);
  console.log('in getToken');
  // oauth2Client.setCredentials();
  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });
  res.locals.token = tokens;
  const ticket = await oauth2Client.verifyIdToken(
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
  // try {
  //   const payload = await ticket.getPayload();
  //   res.locals.userInfo = {
  //     id: payload.sub,
  //     name: payload.name,
  //     email: payload.email,
  //     image: payload.picture,
  //   };
  // } catch (error) {
  //   return next({
  //     log: 'oauth.getToken ERROR: could not getPayload',
  //     status: 500,
  //     message: { err: error },
  //   });
  // } finally {
  //   return next();
  // }
};

export default oauth;
// oauth.handleUser = () => {
//   // if there is a refresh_token in the returned token object, it's the first time a user is
//   // authenticating --> Create a user
//   if (tokens.refresh_token) {
//   }
// };
