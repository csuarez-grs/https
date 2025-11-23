const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { settings } = require('../settings');
const User = require('../Models/User'); // User model
const argon2 = require('argon2');       // Library to create hash

passport.use(new GoogleStrategy({
    clientID: settings.client_id,
    clientSecret: settings.client_secret,
    callbackURL: settings.redirect_uri,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    console.log('Google profile:', profile);
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
