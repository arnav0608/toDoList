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

// Header component for the application title
const Header = () => {
  return (
    <h1 className="header-title-new">
      Daily Planner
    </h1>
  );
};

// ToDoList component to render the collection of ToDoItem components
const ToDoList = ({ todos, toggleComplete, deleteTodo, toggleEdit, saveEdit }) => {
  return (
    <ul className="todo-list-new">
      {/* Map through the todos array and render a ToDoItem for each */}
      {todos.map((todo) => (
        <ToDoItem
          key={todo.id} // Unique key for each list item, crucial for React performance
          todo={todo}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          toggleEdit={toggleEdit}
          saveEdit={saveEdit}
        />
      ))}
    </ul>
  );
};

// ToDoItem component to display and manage a single to-do item
const ToDoItem = ({ todo, toggleComplete, deleteTodo, toggleEdit, saveEdit }) => {
  const [editedText, setEditedText] = useState(todo.text);

  // Handle changes in the edit input field
  const handleEditChange = (e) => {
    setEditedText(e.target.value);
  };

  // Handle saving the edited text when Enter is pressed or input loses focus
  const handleSave = () => {
    if (editedText.trim() === '') {
      // If edited text is empty, delete the todo instead of saving empty
      deleteTodo(todo.id);
    } else {
      saveEdit(todo.id, editedText.trim());
    }
  };

  return (
    <li
      className={`todo-item-new ${todo.completed ? 'completed' : ''}`}
    >
      {/* Checkbox to mark task as completed */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
        className="todo-checkbox-new"
        aria-label={`Mark "${todo.text}" as completed`}
      />

      {/* Conditional rendering for editing mode or display mode */}
      {todo.editing ? (
        <input
          type="text"
          value={editedText}
          onChange={handleEditChange}
          onBlur={handleSave} // Save when input loses focus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave(); // Save when Enter key is pressed
            }
          }}
          className="edit-input-new"
          autoFocus // Automatically focus the input when it appears
          aria-label={`Edit todo: ${todo.text}`}
        />
      ) : (
        <span
          className={`todo-text-new ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={() => toggleEdit(todo.id)} // Enable edit on double click
          aria-label={`Todo item: ${todo.text}. Double click to edit.`}
        >
          {todo.text}
        </span>
      )}

      {/* Action buttons: Edit and Delete */}
      <div className="action-buttons-new">
        {!todo.completed && !todo.editing && ( // Only show edit if not completed and not already editing
          <button
            onClick={() => toggleEdit(todo.id)}
            className="action-button-new edit-button-new"
            aria-label={`Edit "${todo.text}"`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.646 3.646l-2.828 2.828-1.414-1.414L8.586 6.757 10 5.343 13.586 8.93l-3.646 3.646zM15 12V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-6h-2v6H4V6h9v2h2z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => deleteTodo(todo.id)}
          className="action-button-new delete-button-new"
          aria-label={`Delete "${todo.text}"`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

// Export the main App component as default
export default App;