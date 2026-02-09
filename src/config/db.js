import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the project root (one level up from src/config)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Debugging: Check if environment variables are loaded
if (!process.env.DB_USER) {
    console.error('CRITICAL: DB_USER is not defined. Check your .env file at:', path.join(__dirname, '../../.env'));
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true // useful for running the schema script if needed
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database via connection pool');
        connection.release();
    }
});

export default pool;
