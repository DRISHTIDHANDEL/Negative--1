require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('StackIt Backend API is running!');
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/notifications', require('./routes/notificationRoutes'));

app.use('/api/admin', require('./routes/adminRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));