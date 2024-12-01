// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user ID to the request object
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { verifyToken };
