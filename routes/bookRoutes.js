const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define CRUD routes
router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBookById); // Added route to get a book by ID
router.post('/books', bookController.addBook);
router.put('/books/:id', bookController.updateBook);
router.patch('/books/:id', bookController.partialUpdateBook);
router.delete('/books/:id', bookController.deleteBook);

// Open Library search route
router.get('/search-open-library', bookController.getBooksFromOpenLibrary);

module.exports = router;

