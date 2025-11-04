const express = require('express');
const decode = require('../middleware/decodeJWT');
const authorizeRequest = require('../middleware/authorize');

const adminRouter = express.Router();

adminRouter.use(decode);

adminRouter.get('/admin', authorizeRequest(['admin', 'intern','dev']), (req, res) => {
    console.log("get /admin route");
    res.status(200).json({message: "Access grated to admin user"});
});

adminRouter.post('/admin', authorizeRequest(['admin', 'manager']), (req,res) => {
    // TODO: Implement this route
});

module.exports = adminRouter;