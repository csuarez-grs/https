const express = require('express');
const User = require('../Models/User'); // User model
const argon2 = require('argon2');       // Library to create hash
const jwt = require('jsonwebtoken');    // Library to generate JWT token
const { body, validationResult, email } = require('express-validator');
const escapeHtml = require('escape-html');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {email, password, username, role} = req.body;

        console.log(`Email: ${email}`);

        const hashPassword = await argon2.hash(password);

        const newUser = new User(
            {
                email: email, 
                password: hashPassword, 
                username: username,
                role: role // Default role for new users
            }
        );

        await newUser.save();

        res.status(201).json({
            message: `User is registered successfully`,
            user: {
                email: newUser.email,
                username: newUser.username,
                role: newUser.role || 'user'
            }
        });

    } catch(err) {
        console.error(`Error in user registration`);
        console.error(err);
        res.status(500).json({message: `Internal server error : ${err.message}`});
    }
});

router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body;
        console.log(`Login request for ${email}`);

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid user name or password"});
        }

        const isMatch = await argon2.verify(user.password, password);

        if(!isMatch) {
            return res.status(400).json({message: "Invalid user name or password"});
        }

        const token = jwt.sign(
            {
                email: user.email,
                username: user.username,
                role: user.role || 'user' // Default to 'user' if role is not set   
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        )

        res.cookie('auth_token', token, {
            httpOnly: true, // CRITICAL: Prevents client-side JS from accessing the cookie.
            secure: false, // Set it true for HTTPS (production environment)
            sameSite: 'lax', // CSRF protection
            maxAge: 1000 * 60 * 60 // Match token expiration (15 minutes)
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                email: user.email,
                username: user.username,
                role: user.role || 'user'
            }
        });
    } catch(error) {
        console.error("Error while login");
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    if (req.session) {
        req.session.destroy(() => {});
    }
    return res.status(200).json({ message: 'Logout successful' });
});

router.put('/profile', async (req, res) => {
    try {
        const { email, username, bio } = req.body;
        console.log(`Profile update request for ${email}`);

        // Sanitize email input with express validator
        await body('email').isEmail().normalizeEmail().run(req);
        await body('username').trim().escape().run(req);
        await body('bio').trim().escape().run(req);

        // Check length of username and bio
        await body('username').isLength({ min: 3, max: 50 }).run(req);
        await body('bio').isLength({ max: 500 }).run(req);

        // prevent malicious input
        const sanitizedUsername = escapeHtml(username);
        const sanitizedBio = escapeHtml(bio);
        const sanitizedEmail = escapeHtml(email);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.username = sanitizedUsername || user.username;
        user.email = sanitizedEmail || user.email;
        user.bio = sanitizedBio || user.bio;
        await user.save();

        res.status(200).json({ message: "Profile updated successfully", 
            user: { username: user.username, email: user.email, bio: user.bio }     
        });
    } 
    catch (error) {
        console.error("Error while updating profile");
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
