const jwt = require('jsonwebtoken');    // Library to generate JWT token
 
function decode(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({message: "No token, access denied"});
    }
 
    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedUser;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({message: "Token is not valid, access denied"});
    }
}
 
module.exports = decode;