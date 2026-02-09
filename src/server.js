import path from 'path';
import { fileURLToPath } from 'url';

// Static folder resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Routes

// Get all todos
app.get('/api/todos', (req, res) => {
    const query = 'SELECT * FROM tbl_todos ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching todos:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Transform data to match frontend expectations (camelCase)
        const todos = results.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            completed: !!row.completed, // Convert 0/1 to boolean
            priority: row.priority,
            project: row.project,
            assignedTo: row.assigned_to,
            createdAt: row.created_at,
            dueDate: row.due_date,
            dueTime: row.due_time
        }));

        res.json(todos);
    });
});

// Create a new todo
app.post('/api/todos', (req, res) => {
    const { title, description, priority, project, assignedTo, dueDate, dueTime } = req.body;

    const query = `
        INSERT INTO tbl_todos (title, description, priority, project, assigned_to, due_date, due_time, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // Handle simplified date string YYYY-MM-DD from frontend
    // If dueDate is passed as "2023-09-25T00:00:00.000Z", we need to format it or use DATE() in SQL

    const valAssign = assignedTo || null;
    let valDate = dueDate ? new Date(dueDate) : null;

    db.query(query, [title, description, priority, project, valAssign, valDate, dueTime], (err, result) => {
        if (err) {
            console.error('Error creating todo:', err);
            res.status(500).json({ msg: 'Internal Server Error', error: err.message });
            return;
        }
        const insertId = result.insertId;

        // Fetch the created todo to return it
        db.query('SELECT * FROM tbl_todos WHERE id = ?', [insertId], (err, rows) => {
            if (err) {
                res.status(500).json({ msg: 'Internal Server Error', error: err.message });
                return;
            }
            const row = rows[0];
            const newTodo = {
                id: row.id,
                title: row.title,
                description: row.description,
                completed: !!row.completed,
                priority: row.priority,
                project: row.project,
                assignedTo: row.assigned_to,
                createdAt: row.created_at,
                dueDate: row.due_date,
                dueTime: row.due_time
            };
            res.status(201).json(newTodo);
        });
    });
});

// Update todo status (toggle completion)
app.patch('/api/todos/:id/toggle', (req, res) => {
    const id = req.params.id;
    // Toggle the completed status
    const query = 'UPDATE tbl_todos SET completed = NOT completed WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error updating todo:', err);
            res.status(500).json({ msg: 'Internal Server Error', error: err.message });
            return;
        }
        res.json({ message: 'Todo updated successfully' });
    });
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM tbl_todos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting todo:', err);
            res.status(500).json({ msg: 'Internal Server Error', error: err.message });
            return;
        }
        res.json({ message: 'Todo deleted successfully' });
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM tbl_todo_users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ msg: 'Internal Server Error', error: err.message });
            return;
        }

        const users = {};
        results.forEach(row => {
            users[row.id] = {
                id: row.id,
                name: row.name,
                color: row.color,
                initial: row.initial
            };
        });

        res.json(users);
    });
});

// health check
app.get('/health', (req, res) => {
    res.json({ message: 'OK', timestamp: new Date().toISOString(), db: 'connected' });
});

// debug env (Diagnostic only - DELETE LATER)
app.get('/api/debug-env', async (req, res) => {
    const fs = await import('fs');
    const rootPath = path.join(__dirname, '../');
    let files = [];
    try {
        files = fs.readdirSync(rootPath).filter(f => !f.startsWith('node_modules'));
    } catch (e) {
        files = ['Error reading root: ' + e.message];
    }

    res.json({
        cwd: process.cwd(),
        dirname: __dirname,
        rootPath: rootPath,
        filesFound: files,
        envVars: {
            DB_HOST: process.env.DB_HOST ? 'SET (value starts with ' + process.env.DB_HOST.substring(0, 3) + ')' : 'MISSING',
            DB_USER: process.env.DB_USER ? 'SET' : 'MISSING',
            DB_NAME: process.env.DB_NAME ? 'SET' : 'MISSING',
            PORT: process.env.PORT
        }
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
