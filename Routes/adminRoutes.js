const express = require('express');
const authorizeRequest = require('../middleware/authorize');
const decode = require('../middleware/decodeJWT');

const adminRouter = express.Router();

adminRouter.use(decode);

// Example admin-only route: get all users
adminRouter.get('/admin/users', authorizeRequest(['admin']), (req, res) => {
    // Replace with actual user fetching logic
    res.json({ message: 'List of users for admin' });
});

// Example admin-only route: dashboard
adminRouter.get('/admin/dashboard', authorizeRequest(['admin']), (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

module.exports = adminRouter;
