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
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
   // console.log("deserialize...");
  done(null, user);
});