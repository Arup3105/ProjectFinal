
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {mongoURI, environment}= require("./config/default.json")
const path = require("path")


const allowedOrigins = [
  //'https://bcrecplacementportal-3n4xtk6mo-arupduttas-projects.vercel.app'
  'https://bcrapclacementportal.vercel.app'
];

const app = express();
const PORT = 5000;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
//app.use(express.raw({ limit: '50mb' }));

// MongoDB 
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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});



// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const {mongoURI}= require("./config/default.json")

// const app = express();
// const PORT = 5000;
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || origin === 'http://localhost:5173') {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb', extended: true }));
// //app.use(express.raw({ limit: '50mb' }));

// // MongoDB 
// const mongourl = mongoURI;
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log('MongoDB connection established successfully');
// });

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const postRoutes = require('./routes/postRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');

// app.use('/auth', authRoutes);
// app.use('/user', userRoutes);
// app.use('/admin', adminRoutes);
// app.use('/posts', postRoutes);
// app.use('/reviews', reviewRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on port: ${PORT}`);
// });