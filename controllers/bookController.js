const axios = require('axios');
const db = require('../models/database');

// Get all books from the local database
exports.getBooks = (req, res) => {
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            console.error('Error fetching books:', err.message);
            return res.status(500).send('Server error');
        }
        res.json(rows);
    });
};

// Get a single book from the local database by ID
exports.getBookById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching book by ID:', err.message);
            return res.status(500).send('Server error');
        }
        if (!row) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(row);
    });
};

// Add a new book to the local database
exports.addBook = (req, res) => {
    const { title, author, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required.' });
    }

    const sql = `INSERT INTO books (title, author, description) VALUES (?, ?, ?)`;
    const params = [title, author, description || null];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error adding book:', err.message);
            return res.status(500).json({ error: 'Failed to add book.' });
        }
        res.status(201).json({ id: this.lastID, title, author, description });
    });
};

// Update an existing book based on its ID
exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { title, author, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required.' });
    }

    const sql = `UPDATE books SET title = ?, author = ?, description = ? WHERE id = ?`;
    const params = [title, author, description, id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error updating book:', err.message);
            return res.status(500).json({ error: 'Failed to update book.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json({ message: 'Book updated successfully.' });
    });
};

// Partially update an existing book based on its ID
exports.partialUpdateBook = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No update data provided.' });
    }

    let sql = 'UPDATE books SET ';
    const params = [];
    const keys = Object.keys(updates);

    keys.forEach((key, index) => {
        sql += `${key} = ?`;
        params.push(updates[key]);
        if (index < keys.length - 1) sql += ', ';
    });

    sql += ' WHERE id = ?';
    params.push(id);

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error partially updating book:', err.message);
            return res.status(500).json({ error: 'Failed to partially update book.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json({ message: 'Book partially updated successfully.' });
    });
};

// Delete a book based on its ID
exports.deleteBook = (req, res) => {
    const { id } = req.params;

    const sql = `DELETE FROM books WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error deleting book:', err.message);
            return res.status(500).json({ error: 'Failed to delete book.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found.' });
        }
        res.status(200).json({ message: 'Book deleted successfully.' });
    });
};

// Fetch books from the Open Library API
exports.getBooksFromOpenLibrary = async (req, res) => {
    try {
        const query = req.query.q || ''; // Accept a query parameter to search books
        const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        
        // Extract relevant information from the response
        const books = response.data.docs.map(book => ({
            title: book.title,
            author_name: book.author_name ? book.author_name.join(', ') : 'Unknown',
            published_date: book.publish_date ? book.publish_date[0] : 'Unknown'
        }));

        res.json(books);
    } catch (error) {
        console.error('Error fetching data from Open Library:', error);
        res.status(500).json({ error: 'Failed to fetch books from Open Library' });
    }
};
