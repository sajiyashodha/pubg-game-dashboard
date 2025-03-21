// db.js - MySQL (use 'pg' for PostgreSQL)
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'pubg',
  bigNumberStrings: true,
});

// Export the pool for use in other files
module.exports = pool;
