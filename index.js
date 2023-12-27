const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const router = require('./router');
const { fail } = require('assert');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Example if you're using EJS
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router)

app.listen(PORT, () => {
    console.log("Server is running on ${PORT}");
});
