const express = require('express');
const mysql = require('mysql2');
const request = require('request');

const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sitienei@2016',
  database: 'node_api',
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Define the API endpoint
app.get('/api/users', (req, res) => {
  // Make a request to the third-party API
  // Replace `api_endpoint_url` with the actual URL of the API you're consuming
  request.get('https://jsonplaceholder.typicode.com/users', (err, response, body) => {
    if (err) {
      console.error('Error fetching API data:', err);
      res.sendStatus(500);
      return;
    }

    if (response.statusCode !== 200) {
      console.error('Unexpected API response:', response.statusCode);
      res.sendStatus(500);
      return;
    }

    const apiData = JSON.parse(body);

    // Insert the API data into the MySQL database
    connection.query('INSERT INTO api(name, email) VALUES ?', [apiData.map(obj => [obj.name, obj.email])], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
