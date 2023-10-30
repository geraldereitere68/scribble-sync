/**
 * filename: sophisticated_code.js
 * 
 * This code demonstrates a sophisticated and elaborate implementation of a web-based task management system.
 * It includes features like user authentication, task creation, task assignment, status tracking, and reporting.
 * 
 * Note: This code is a simplified version for demonstration purposes and may not include full functionality or error handling.
 */

// Import necessary modules, libraries, and frameworks

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create an Express application

const app = express();

// Configure middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define database models and schema

const User = require('./models/User');
const Task = require('./models/Task');

// Define API endpoints

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error('Incorrect username or password');
    
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Task creation endpoint
app.post('/api/tasks', async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;
    
    const newTask = new Task({ title, description, assignedTo });
    await newTask.save();
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task retrieval endpoint
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task update endpoint
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Task deletion endpoint
app.delete('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    await Task.findByIdAndRemove(taskId);
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server

app.listen(3000, () => {
  console.log('Server started on port 3000');
});