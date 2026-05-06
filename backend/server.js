const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================

// Task Management Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// User Authentication Routes
app.use('/api/users', require('./routes/userRoutes'));

// ================= HEALTH CHECK =================
app.get('/', (req, res) => {
    res.send('🚀 TaskFlow API Running Successfully...');
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});