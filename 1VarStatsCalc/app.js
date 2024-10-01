const express = require('express');
const path = require('path');
const statsRouter = require('./routes/stats');

const app = express();

// use built-in express middleware for JSON and URL-encoded body parsing
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

// serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// use the stats route
app.use('/stats', statsRouter);

// serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
