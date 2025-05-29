require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Database Connection
connectDB();

mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});

// Routes
app.use('/api/events', require('./routes/eventRoutes'));

// Client-Side Routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

// Error Handling
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});