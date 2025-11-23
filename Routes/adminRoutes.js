const express = require('express');
const { ensureAdmin } = require('../middleware/authorize');

const adminRouter = express.Router();

// Example admin-only route: get all users
adminRouter.get('/admin/users', ensureAdmin, (req, res) => {
    // Replace with actual user fetching logic
    res.json({ message: 'List of users for admin' });
});

// Example admin-only route: dashboard
adminRouter.get('/admin/dashboard', ensureAdmin, (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

module.exports = adminRouter;
