const express = require('express');
const passport = require('../auth_strategies/passport');
const { settings } = require('../settings');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// Initialize Passport
authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    failureRedirect: '/login'
    }));

authRouter.get(settings.google_callback_url,
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        console.log('User authenticated:', req.user);

        const token = jwt.sign({ 
                id: req.user.id,
                email: req.user.emails[0].value,
                name: req.user.displayName
            }, 
            settings.jwtSecret
        );
        // res.status(200).json({
        //     message: 'Authentication successful',
        //     user: req.user,
        //     token: token
        // });

        res.redirect('http://localhost:5173/oauth_lab/dashboard?token=' + token 
            + '&user='+req.user.displayName +'' + req.user?.emails[0].value + ''); // Redirect to the specified URI after authentication
    });



module.exports = authRouter;
