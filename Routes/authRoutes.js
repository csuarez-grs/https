const express = require('express');
const passport = require('../auth_strategies/passport');
const { settings } = require('../settings');
const User = require('../Models/User'); // User model
const argon2 = require('argon2');       // Library to create hash
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
    async (req, res) => {
        console.log('User authenticated:', req.user);
        const email = req.user.emails[0].value;
        const foundUser = await User.findOne({email});
        const displayName = req.user.displayName
        const hashPassword =  await argon2.hash(req.user.id); // Hash the Google ID as a password placeholder
        const token = jwt.sign({ 
                id: req.user.id,
                email: req.user.emails[0].value,
                name: displayName
            }, 
            settings.jwtSecret
        );

        if (!foundUser) {
            // If user does not exist, create a new user
            const role = 'user';
            
            const newUser = new User({
                email: req.user.emails[0].value, 
                password: hashPassword,
                username: displayName,
                role: role // Default role for new users
            });
            await newUser.save();
        } else {
            // If user exists, you might want to update their info
            foundUser.username = displayName;
            foundUser.password = hashPassword;
            await foundUser.updateOne();
        }
        
        // res.status(200).json({
        //     message: 'Authentication successful',
        //     user: req.user,
        //     token: token
        // });

        res.redirect('http://localhost:5173/home/'+displayName); // Redirect to the specified URI after authentication
    });


module.exports = authRouter;
