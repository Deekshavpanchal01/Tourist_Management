require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tourist = require('./models/Tourist');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ Could not connect to MongoDB', err);
  console.log('Connection string used:', process.env.MONGODB_URI);
});

// CRUD Endpoints

// Create a tourist record
app.post('/tourists', async (req, res) => {
  try {
    const tourist = new Tourist(req.body);
    await tourist.save();
    res.status(201).send(tourist);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all tourists
app.get('/tourists', async (req, res) => {
  try {
    const tourists = await Tourist.find().sort({ createdAt: -1 });
    res.send(tourists);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get single tourist
app.get('/tourists/:id', async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).send();
    res.send(tourist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update tourist
app.put('/tourists/:id', async (req, res) => {
  try {
    const tourist = await Tourist.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!tourist) return res.status(404).send();
    res.send(tourist);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete tourist
app.delete('/tourists/:id', async (req, res) => {
  try {
    const tourist = await Tourist.findByIdAndDelete(req.params.id);
    if (!tourist) return res.status(404).send();
    res.send(tourist);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log('\n====================================');
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log('====================================\n');
  console.log('Available endpoints:');
  console.log(`- GET    http://localhost:${port}/tourists`);
  console.log(`- POST   http://localhost:${port}/tourists`);
  console.log(`- GET    http://localhost:${port}/tourists/:id`);
  console.log(`- PUT    http://localhost:${port}/tourists/:id`);
  console.log(`- DELETE http://localhost:${port}/tourists/:id`);
  console.log('\nPress CTRL+C to stop the server');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
});