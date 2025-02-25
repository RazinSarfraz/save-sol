// index.js
require('dotenv').config();
const express = require('express');
const redisClient = require('./db/redis');
const routes = require('./routes');
const { initializeDB } = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.get('/ping', (req, res) => {
    res.status(200).json({
        code: 200,
        message: 'Success',
    });
});

app.use(express.json());
app.use('/save-karo',routes);


initializeDB().then(() => {
    app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
    });
}).catch(err => {
    console.error("❌ Failed to initialize database", err);
});