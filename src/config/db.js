import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- DB DIAGNOSTIC: process.cwd() is:', process.cwd());
console.log('--- DB DIAGNOSTIC: __dirname is:', __dirname);

// Attempt to List files in root to see if .env is there
try {
    const projectRoot = path.join(__dirname, '../../');
    console.log('--- DB DIAGNOSTIC: Looking for .env in project root:', projectRoot);
    if (fs.existsSync(projectRoot)) {
        const files = fs.readdirSync(projectRoot);
        console.log('--- DB DIAGNOSTIC: Files found in root:', files.filter(f => !f.startsWith('node_modules')));
    }
} catch (e) {
    console.log('--- DB DIAGNOSTIC: Error listing root files:', e.message);
}

// Potential .env paths
const paths = [
    path.join(__dirname, '../../.env'), // From src/config/
    path.join(process.cwd(), '.env'),    // From current working directory
    path.join(process.cwd(), 'public_html/.env'), // Hostinger common root
];

let envFound = false;
for (const envPath of paths) {
    try {
        if (fs.existsSync(envPath)) {
            console.log('--- DB CONFIG: Attempting to load .env from:', envPath);
            const result = dotenv.config({ path: envPath });
            if (result.error) {
                console.error('--- DB CONFIG ERROR: dotenv failed to parse file:', result.error.message);
            } else {
                console.log('--- DB CONFIG: Successfully loaded environment from:', envPath);
                envFound = true;
                break;
            }
        }
    } catch (err) {
        console.log(`--- DB CONFIG: Search skipped for ${envPath}: ${err.message}`);
    }
}

if (!envFound) {
    console.error('--- DB CONFIG CRITICAL: .env file NOT FOUND in any locations:', paths);
}

// Diagnostic check (avoid logging actual password)
if (!process.env.DB_USER) {
    console.error('--- DB CONFIG ERROR: DB_USER is still undefined.');
} else {
    console.log('--- DB CONFIG: DB_USER verified as:', process.env.DB_USER.substring(0, 3) + '...');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
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

// Test the connection immediately
pool.getConnection((err, connection) => {
    if (err) {
        console.error('--- DB CONNECTION ERROR:', err.code, err.message);
    } else {
        console.log('--- DB CONNECTION SUCCESS: Connected to', (process.env.DB_NAME || 'default_db'));
        connection.release();
    }
});

export default pool;
