const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      
      // Check if the user exists
      if (user) {
        console.log('User found:', user); // Debugging: log the user details

        // Log the hashed password stored in the database
      console.log('Hashed Password in DB:', user.password);
        
        // Compare the entered password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Debugging: log if passwords match
  
        if (isMatch) {
          // Generate JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          console.log('Generated Token:', token); // Debugging: log the generated token
  
          // Respond with the token
          res.json({ token });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login Error:', error); // Log any errors that occur
      res.status(400).json({ message: 'Error logging in', error });
    }
  });
  
module.exports = router;
