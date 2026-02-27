const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ googleId: profile.id });
    
            if (user) {
                return done(null, user);
            } else {
                // Check if user exists with same username (if we had email, we'd check that too)
                // For now, construct a username from display name
                let username = profile.displayName.replace(/\s+/g, '').toLowerCase();
                
                // Ensure uniqueness (simple logic)
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    username = username + Math.floor(Math.random() * 1000);
                }
    
                const newUser = {
                    googleId: profile.id,
                    username: username,
                    profileImage: profile.photos[0].value
                };
    
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }));
  } else {
      console.log('⚠️ Google Client ID/Secret not found. Real Google Login will not work.');
  }
};
