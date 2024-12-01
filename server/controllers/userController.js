const db = require('../db/db');

const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (!user.rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { getUser };
