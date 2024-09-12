const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: '127.0.0.1',       // Your MySQL server host
    user: 'crowdfunding_db_user',            // Your MySQL username
    password: 'crowdfundingDB@123',    // Your MySQL password
    database: 'crowdfunding_db'  // The database you just created
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the crowdfunding_db database');
});

// Query to fetch data (for testing purposes)
connection.query('SELECT * FROM FUNDRAISER', (err, results) => {
    if (err) {
        console.error('Error fetching data: ', err);
        return;
    }
    console.log('Fundraisers:', results);
    connection.end();  // Close the connection after the query
});
