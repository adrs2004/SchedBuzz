import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckSquare, FaTrashAlt } from 'react-icons/fa';
import './App.css'; // Import the CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Format the time to a readable format (e.g., Jan 3, 2025 - 12:30 PM)
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Customize this if needed
  };

  // Update the clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch todos from backend
  useEffect(() => {
    axios.get(`${apiUrl}/todos`)
      .then(response => setTodos(response.data))
      .catch(error => console.log(error));
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (newTodo) {
      axios.post(`${apiUrl}/todos`, { text: newTodo })
        .then(response => {
          setTodos([...todos, response.data]);
          setNewTodo('');
        })
        .catch(error => console.log(error));
    }
  };

  // Toggle todo completion
  const toggleComplete = (id, completed) => {
    axios.put(`${apiUrl}/todos/${id}`, { completed: !completed })
      .then(response => {
        setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      })
      .catch(error => console.log(error));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`${apiUrl}/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => console.log(error));
  };

  return (
    <div className="app-container">
      <div className="todo-container">
        <div className="header">
          <h1 className="app-title">SchedBuzz</h1>
          <div className="clock">{currentTime}</div>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="todo-input"
            placeholder="Enter a new task"
          />
          <button
            onClick={addTodo}
            className="add-button"
          >
            Add
          </button>
        </div>
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo._id} className="todo-item">
              <div className="todo-item-content">
                <FaCheckSquare
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  className={`check-icon ${todo.completed ? 'completed' : ''}`}
                />
                <span className={`todo-text ${todo.completed ? 'completed-text' : ''}`}>
                  {todo.text}
                </span>
                {/* Display the time */}
                <span className="todo-time">{formatTime(todo.time)}</span>
              </div>
              <FaTrashAlt
                onClick={() => deleteTodo(todo._id)}
                className="delete-icon"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
