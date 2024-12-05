// Fetch and display books from the backend
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books');
        const books = await response.json();

        const bookList = document.getElementById('book-list');
        bookList.innerHTML = ''; // Clear existing content

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
                <button onclick="editBook(${book.id})">Edit</button>
                <button onclick="deleteBook(${book.id})">Delete</button>
            `;

            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Fetch and display recommended books from the backend
async function fetchRecommendations() {
    try {
        const response = await fetch('http://localhost:3000/api/recommendations');
        const recommendations = await response.json();

        const recommendationsSection = document.createElement('section');
        recommendationsSection.innerHTML = '<h2>Recommended Books</h2>';

        recommendations.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('recommended-book');

            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
            `;

            recommendationsSection.appendChild(bookItem);
        });

        document.body.appendChild(recommendationsSection);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Open the modal for adding or editing a book
function openModal(book = null) {
    const modal = document.getElementById('book-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('book-form');

    if (book) {
        modalTitle.textContent = 'Edit Book';
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('description').value = book.description;

        form.onsubmit = (event) => {
            event.preventDefault();
            updateBook(book.id);
        };
    } else {
        modalTitle.textContent = 'Add a New Book';
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('description').value = '';

        form.onsubmit = (event) => {
            event.preventDefault();
            addBook();
        };
    }

    modal.style.display = 'block';
}

// Add a new book to the database
async function addBook() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, description })
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        fetchBooks();
        closeModal();
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Edit a book by opening the modal with the existing data
function editBook(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            openModal(book);
        })
        .catch(error => {
            console.error('Error fetching book for editing:', error);
        });
}

// Update an existing book
async function updateBook(bookId) {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, description })
        });

        if (!response.ok) {
            throw new Error('Failed to update book');
        }

        fetchBooks();
        closeModal();
    } catch (error) {
        console.error('Error updating book:', error);
    }
}

// Delete a book from the database
async function deleteBook(bookId) {
    try {
        const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete book');
        }

        fetchBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('book-modal');
    modal.style.display = 'none';
}

// Load books and recommendations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    fetchRecommendations();
});
