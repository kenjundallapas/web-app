// Fetch and display books from the backend
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/books');
        const books = await response.json();

        const bookList = document.getElementById('book-list');
        bookList.innerHTML = ''; // Clear any existing content

        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');

            bookItem.innerHTML = `
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Description:</strong> ${book.description}</p>
            `;

            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Fetch and display recommended books
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

// Add a new book to the database
async function addBook(bookData) {
    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }

        // Reload the books list after adding a new book
        fetchBooks();
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

// Handle form submission to add a new book
document.getElementById('book-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;

    if (title && author) {
        const newBook = {
            title,
            author,
            description
        };

        addBook(newBook);

        // Clear the form fields after submission
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('description').value = '';
    } else {
        alert('Title and Author are required fields');
    }
});

// Load the books and recommendations when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    fetchRecommendations();
});
