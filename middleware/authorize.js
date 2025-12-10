const authorizeRequest = (roles= []) => {
    console.log("Autorizing request");
    return (req, res, next) => {
        if(!req.user || !req.user.role) {
            return res.status(401).json({message:"Not Authorized. Access denied"});
        }
        if(roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({message:"Not Authorized. Access denied"});
        }
    }
}

module.exports = authorizeRequest;
