require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('./config/database');
const path = require('path');

const app = express();

// Database connection
Database.init();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/courses', require('./routes/course'));
app.use('/students', require('./routes/student'));
app.use('/admin', require('./routes/admin.route'));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`****Application is running ${PORT}`);
});