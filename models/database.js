const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./library.db', (err) => {
    if(err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});


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

    db.get('SELECT COUNT(*) AS count FROM books', (err, row) => {
        if (err) {
            console.error('Error checking book count:', err.message);
        } else if (row.count === 0) {

            db.run(`
                INSERT INTO books (title, author, description)
                VALUES ('Sample Book', 'Sample Author', 'This is a sample book.')
            `);
        }
    });
});

module.exports =db;