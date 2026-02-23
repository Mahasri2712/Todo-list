import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

const API_URL = "http://localhost:8080/api/tasks";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    axios.post(API_URL, {
      description: newTask,
      completed: false
    }).then(response => {
      setTasks([...tasks, response.data]);
      setNewTask("");
    });
  };

  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      });
  };

  const toggleStatus = (id) => {
    axios.put(`${API_URL}/${id}/status`)
      .then(response => {
        setTasks(tasks.map(task =>
          task.id === id ? response.data : task
        ));
      });
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          value={newTask}
          placeholder="Enter task..."
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleStatus(task.id)}>
              {task.description}
            </span>
            <p>
              {task.completed ? "Completed" : " Pending"}
            </p>

            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;