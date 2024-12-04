async function getBooks() {
    try {
        const response = await fetch('/books');
        const books = await response.json();
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.textContent = `${book.title} by ${book.author} - ${book.description}`;
            bookList.appendChild(bookItem);
        });
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, author, description })
        });

        if (response.ok) {
            alert('Book added successfully!');
            getBooks();
        } else {
            alert('Failed to add the book.');
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

getBooks();