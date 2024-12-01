const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const registerUser = async (req, res) => {
    const { name, email, password, number, age } = req.body;
    try {
        if (age < 18) {
            return res.status(400).json({ message: 'Age must be 18 or above.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password, number, age) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, age, number',
            [name, email, hashedPassword, number, age]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!user.rows.length) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token, user: user.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { registerUser, loginUser };
