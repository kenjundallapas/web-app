const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the 'books' table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            description TEXT,
            date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

module.exports = db;
