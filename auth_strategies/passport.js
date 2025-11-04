const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const { settings } = require('../settings');

passport.use(new GoogleStrategy({
    clientID: settings.client_id,
    clientSecret: settings.client_secret,
    callbackURL: settings.redirect_uri,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    console.log('Google profile:', profile);
    // Here you can save the user profile to your database or session
    // For now, we will just return the profile
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
