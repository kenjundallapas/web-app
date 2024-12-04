const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import CORS middleware
const bookRoutes = require('./routes/bookRoutes'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Use the book routes
app.use('/api', bookRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Online Library!');
});

app.get('/api/recommendations', (req, res) => {
    const recommendations = [
        { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
        { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke' },
        { title: 'You Don\'t Know JS', author: 'Kyle Simpson' },
        { title: 'Clean Code', author: 'Robert C. Martin' }
    ];
    res.json(recommendations);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
