const express = require('express');
const User = require('../Models/User'); // User model
const argon2 = require('argon2');       // Library to create hash
const jwt = require('jsonwebtoken');    // Library to generate JWT token
const { body, validationResult } = require('express-validator');
const escapeHtml = require('escape-html');
const decode = require('../middleware/decodeJWT');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        await body('email').isEmail().normalizeEmail().run(req);
        await body('password').isLength({ min: 6 }).run(req);
        await body('username').trim().isLength({ min: 3, max: 50 }).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password, username} = req.body;

        console.log(`Email: ${email}`);

        const hashPassword = await argon2.hash(password);

        const newUser = new User(
            {
                email: email, 
                password: hashPassword, 
                username: username,
                role: 'user' // Force default role
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
        await body('email').isEmail().normalizeEmail().run(req);
        await body('password').isLength({ min: 6 }).run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
            secure: process.env.NODE_ENV === 'production', // HTTPS in production
            sameSite: 'strict', // CSRF protection
            maxAge: 1000 * 60 * 30 // Short-lived cookie (30 minutes)
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    if (req.session) {
        req.session.destroy(() => {});
    }
    return res.status(200).json({ message: 'Logout successful' });
});

router.put('/profile', decode, async (req, res) => {
    try {
        const { username, bio } = req.body;
        const authEmail = req.user?.email;
        if (!authEmail) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log(`Profile update request for ${authEmail}`);

        await body('username').optional().trim().isLength({ min: 3, max: 50 }).run(req);
        await body('bio').optional().trim().isLength({ max: 500 }).run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const sanitizedUsername = username ? escapeHtml(username) : undefined;
        const sanitizedBio = bio ? escapeHtml(bio) : undefined;

        const user = await User.findOne({ email: authEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.username = sanitizedUsername || user.username;
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
