require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

// PostgreSQL configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// API Routes
app.post('/signals', async (req, res) => {
    const { location, description, images, contact } = req.body;
    try {
        const newSignal = await pool.query(
            'INSERT INTO signals (location, description, images, contact) VALUES ($1, $2, $3, $4) RETURNING *',
            [location, description, images, contact]
        );
        res.json(newSignal.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/signals', async (req, res) => {
    try {
        const allSignals = await pool.query('SELECT * FROM signals');
        res.json(allSignals.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));