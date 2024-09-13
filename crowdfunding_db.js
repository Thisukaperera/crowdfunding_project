const express = require('express');
const mysql = require('mysql');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'crowdfunding_db_user',
    password: 'crowdfundingDB@123',
    database: 'crowdfunding_db'
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
    const query = 'SELECT * FROM FUNDRAISER WHERE active = 1';
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

// 3. GET active fundraisers based on search criteria
app.get('/api/fundraisers/search', (req, res) => {
    const searchTerm = req.query.query;
    const query = 'SELECT * FROM FUNDRAISER WHERE active = 1 AND title LIKE ?';
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
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
    const query = 'SELECT * FROM FUNDRAISER WHERE id = ?';
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
