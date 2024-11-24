const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());

// Database Configuration
const dbConfig = {
  user: 'wit-registration-server-admin', // Server admin username
  password: '5US-Ec54FeTZ88b', // Replace with your password
  server: 'wit-registration-server.database.windows.net', // Server name
  database: 'wit-registration-database', // Replace with your database name
  options: {
    encrypt: true, // Encrypt connection for Azure SQL
  },
};

// Connect to the database
let pool;
(async () => {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to Azure SQL Database!');
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

// API Endpoint for Form Submission
app.post('/api/submit', async (req, res) => {
  const { name, address, phone, email, school } = req.body;
  try {
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('address', sql.NVarChar, address)
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .input('school', sql.NVarChar, school)
      .query('INSERT INTO Registration (name, address, phone, email, school) VALUES (@name, @address, @phone, @email, @school)');
    res.status(200).send({ message: 'Registration successful!' });
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).send({ error: 'Failed to submit registration.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
