const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const path = require('path'); 
 require('dotenv').config();

 
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK,
    passReqToCallback: true,
    proxy: true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});