const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS module
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/commentRoutes')
const captureSessionDetails = require('./middlewares/captureUserDetails');
const requestIp = require('request-ip');
const useragent = require('useragent');
const axios = require('axios');
require('dotenv').config();

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('Missing environment variable: DATABASE_URL');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Missing environment variable: JWT_SECRET');
  process.exit(1);
}

app.use(cors()); 
app.use(express.json());
app.use(captureSessionDetails);

app.use('/api/users', userRoutes); 
app.use('/api/blog', blogRoutes);
app.use('/api/comments', commentRoutes);

const port = process.env.PORT || 3000;
const mongoDBUri = process.env.DATABASE_URL;

mongoose.connect(mongoDBUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection has been established successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; 

