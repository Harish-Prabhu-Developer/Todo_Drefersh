import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Potential .env paths
const paths = [
    path.join(__dirname, '../../.env'), // From src/config/
    path.join(process.cwd(), '.env'),    // From current working directory
    path.join(process.cwd(), '../.env'), // One level up from CWD
];

let envFound = false;
for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
        console.log('--- DB CONFIG: Loading .env from:', envPath);
        dotenv.config({ path: envPath });
        envFound = true;
        break;
    }
}

if (!envFound) {
    console.warn('--- DB CONFIG WARNING: No .env file found in any searched locations:', paths);
}

// Diagnostic check (avoid logging actual password)
if (!process.env.DB_USER) {
    console.error('--- DB CONFIG ERROR: DB_USER is still undefined after config attempt.');
} else {
    console.log('--- DB CONFIG: DB_USER detected as:', process.env.DB_USER.substring(0, 3) + '...');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    multipleStatements: true
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
