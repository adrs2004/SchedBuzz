const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error: ', err));

// Todo model
const Todo = mongoose.model('Todo', new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    time: { type: Date, default: Date.now }  // New time field
  }));
  

// Routes
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  const { text } = req.body;
  const todo = new Todo({
    text
  });
  try {
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
