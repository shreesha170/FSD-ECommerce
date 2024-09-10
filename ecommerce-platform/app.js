const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize dotenv to load environment variables
dotenv.config();

// Connect to the database
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Database connected successfully.");
    
    // Initialize the express app
    const app = express();

    // Use middleware to parse JSON request bodies
    app.use(express.json());

    // Define routes
    app.use('/api/products', productRoutes);
    app.use('/api/users', userRoutes);
    // app.use('/api/orders', orderRoutes);

    // Define a basic route for testing
    app.get('/', (req, res) => {
      res.send('API is running...');
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!' });
    });

    // Set the port from .env or default to 5000
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Error connecting to MongoDB:', error));
