const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Backend (Nalanda Library managemnt) is running successfully!');
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
// Add other routes...

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.PORT}`));
