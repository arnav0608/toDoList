import React, { useState, useEffect } from 'react';
// Main App component that orchestrates the To-Do List application
const App = () => {
  // State to hold the list of to-do items
  const [todos, setTodos] = useState(() => {
    // Initialize todos from localStorage if available, otherwise an empty array
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  // State to hold the text for a new to-do item
  const [newTodoText, setNewTodoText] = useState('');

  // Effect hook to save todos to localStorage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new to-do item
  const addTodo = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (newTodoText.trim() === '') return; // Don't add empty todos

    const newTodo = {
      id: Date.now(), // Unique ID based on timestamp
      text: newTodoText.trim(),
      completed: false,
      editing: false, // Flag to indicate if the item is currently being edited
    };
    setTodos([...todos, newTodo]); // Add new todo to the list
    setNewTodoText(''); // Clear the input field
  };

  // Function to toggle the completion status of a to-do item
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Function to delete a to-do item
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Function to enable/disable editing mode for a to-do item
  const toggleEdit = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, editing: !todo.editing } : todo
      )
    );
  };

  // Function to save the edited text of a to-do item
  const saveEdit = (id, newText) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, editing: false } : todo
      )
    );
  };

  return (
    // The main container for the application with a new background
    <div className="app-container-new">
      {/* The card-like container for the To-Do List with new styling */}
      <div className="todo-card-new">
        {/* Header component */}
        <Header />

        {/* Form for adding new to-do items */}
        <form onSubmit={addTodo} className="add-todo-form-new">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="What's on your mind today?"
            className="add-todo-input-new"
            aria-label="New todo text input"
          />
          <button
            type="submit"
            className="add-todo-button-new"
            aria-label="Add todo"
          >
            Add Task
          </button>
        </form>

        {/* ToDoList component to display the list of todos */}
        <ToDoList
          todos={todos}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          toggleEdit={toggleEdit}
          saveEdit={saveEdit}
        />

        {/* Display a message if there are no todos */}
        {todos.length === 0 && (
          <p className="no-tasks-message-new">
            Tip: Press Enter to add a task.
          </p>
        )}
      </div>
    </div>
  );
};