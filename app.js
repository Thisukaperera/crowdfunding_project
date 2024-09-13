const express = require('express');
const mysql = require('mysql');
const app = express();
require('dotenv').config();
const cors = require('cors');

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the crowdfunding_db database');
});

// Define Routes

// 1. GET all active fundraisers (for the Home page)
app.get('/api/fundraisers', (req, res) => {
    const query = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// 2. GET all categories (for the Search page)
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM CATEGORY';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// 3. GET active fundraisers based on search criteria (organizer or city)
app.get('/api/fundraisers/search', (req, res) => {
    const searchTerm = req.query.query;
    const query = 'SELECT * FROM FUNDRAISER WHERE ACTIVE = 1 AND (ORGANIZER LIKE ? OR CITY LIKE ?)';
    connection.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Server error');
            return;
        }
        res.json(results);
    });
});

// 4. GET fundraiser details by ID (for the Fundraiser page)
app.get('/api/fundraisers/:id', (req, res) => {
    const fundraiserId = req.params.id;
    const query = 'SELECT * FROM FUNDRAISER WHERE FUNDRAISER_ID = ?';
    connection.query(query, [fundraiserId], (err, results) => {
        if (err) {
            console.error('Error fetching data: ', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Fundraiser not found');
        } else {
            res.json(results[0]);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
