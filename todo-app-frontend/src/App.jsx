import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckSquare, FaTrashAlt, FaClock, FaCalendarAlt, FaRegSmile } from 'react-icons/fa';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Format the time to a readable format (e.g., Jan 3, 2025 - 12:30 PM)
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Customize this if needed
  };

  // Update the clock and date every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());  // Time
      setCurrentDate(now.toLocaleDateString());  // Date
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
          // Include the time field from the response to maintain synchronization with the backend
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
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 shadow-xl rounded-xl p-8 space-y-6">
        {/* Heading Section */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 tracking-wider">
            SchedBuzz
          </h1>
        </div>

        {/* Time and Date */}
        <div className="flex justify-center space-x-6 text-gray-300 text-lg">
          <div className="flex items-center space-x-2">
            <FaClock className="w-5 h-5 text-gray-400" />
            <span>{currentTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="w-5 h-5 text-gray-400" />
            <span>{currentDate}</span>
          </div>
        </div>

        {/* Display "Hello friend" message if no todos */}
        {todos.length === 0 && (
          <div className="text-center p-6 bg-gray-700 rounded-lg shadow-lg">
            <FaRegSmile className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300">Hello friends, list your schedule here!</p>
          </div>
        )}

        {/* Input Section */}
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-4 border border-gray-600 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-md focus:outline-none transition-all transform"
          >
            Add Task
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-4">
          {todos.map(todo => (
            <li key={todo._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center space-x-4">
                <FaCheckSquare
                  onClick={() => toggleComplete(todo._id, todo.completed)}
                  className={`w-6 h-6 cursor-pointer transition-colors ${todo.completed ? 'text-green-600' : 'text-gray-400'}`}
                />
                <span className={`flex-1 text-xl ${todo.completed ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                  {todo.text}
                </span>
                <span className="text-sm text-gray-500">{formatTime(todo.time)}</span>
              </div>
              <FaTrashAlt
                onClick={() => deleteTodo(todo._id)}
                className="w-6 h-6 text-red-500 cursor-pointer transition-all transform"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
