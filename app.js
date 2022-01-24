const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    try {
        if (isExempted(req.path)) {
            return next();
        }
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
        if (req.body.userId && req.body.userId !== decodedToken.userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({
            error: new Error('Authentication error.')
        });
    }
}

function isExempted(url) {
    for (let exemptedEndPoint of exemptedEndPoints) {
        if (url.endsWith(exemptedEndPoint)) return true
        if (exemptedEndPoint == '/images') {
            if (url.includes('/images')) return true
        }
    }
    return false;
}
  
const exemptedEndPoints = [
    '/signup',
    '/login',
    '/images'
];