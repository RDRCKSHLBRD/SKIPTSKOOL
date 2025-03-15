const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'skiptskool',
    password: 'your_db_password',
    port: 5432,
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Login / Signup Request
app.post('/auth', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
            res.json({ message: 'Account created successfully' });
        } else {
            res.json({ message: 'Login successful' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
