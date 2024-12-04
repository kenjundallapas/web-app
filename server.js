const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to the Online Library!');
});

app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            console.log('Books retrieved:', rows);
            res.json(rows);
        }
    });
});

app.get('/verify-books', (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        } else {
            console.log('Books in database:', rows);
            res.json(rows);
        }
    });
});


app.post('/books', (req,res) => {
    const {title, author, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({error: 'Title and author are required.'});
    }

    const sql = `INSERT INTO books (title, author, description) VALUES (?, ?, ?)`;
    const params = [title, author, description || null];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Failed to add book.' });
        } else {
            res.status(201).json({ id: this.lastID, title, author, description});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});