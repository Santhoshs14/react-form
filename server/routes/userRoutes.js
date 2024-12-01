// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const pool = require('../db/db'); // Adjust to match your database connection setup

// Route to get current user
router.get('/current', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // `req.user` is set by `verifyToken` middleware
        const result = await pool.query('SELECT id, name, email, number, age FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
