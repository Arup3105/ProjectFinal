// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {mongoURI}= require("./config/default.json")

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests from the same host
    if (!origin || origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(bodyParser.json());

// MongoDB Connection
const mongourl = mongoURI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/posts', postRoutes);
app.use('/reviews', reviewRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
