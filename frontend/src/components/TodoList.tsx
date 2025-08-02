
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/todo";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (!newTodoTitle) return;
    const newTodo = { title: newTodoTitle, description: newTodoDescription };
    const response = await axios.post(API_URL, newTodo);
    setTodos([...todos, response.data]);
    setNewTodoTitle("");
    setNewTodoDescription("");
  };

  const updateTodo = async (id: string, updatedTodo: Partial<Todo>) => {
    const response = await axios.put(`${API_URL}/${id}`, updatedTodo);
    setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    setEditingTodo(null);
  };

  const deleteTodo = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Todo title"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Todo description"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
        />
        <button className="w-full p-2 bg-blue-500 text-white rounded" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex items-center justify-between p-2 border-b">
            {editingTodo && editingTodo._id === todo._id ? (
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded mt-2"
                  value={editingTodo.description}
                  onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                />
                 <div className="flex mt-2">
                  <button
                    className="p-2 bg-green-500 text-white rounded mr-2"
                    onClick={() => updateTodo(editingTodo._id, { title: editingTodo.title, description: editingTodo.description })}
                  >
                    Save
                  </button>
                  <button className="p-2 bg-gray-500 text-white rounded" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <span
                  className={`flex-1 cursor-pointer ${todo.completed ? "line-through" : ""}`}
                  onClick={() => updateTodo(todo._id, { completed: !todo.completed })}
                >
                  {todo.title}
                </span>
                <p className="text-sm text-gray-500">{todo.description}</p>
              </div>
            )}
            <div className="flex">
              <button className="p-2 bg-yellow-500 text-white rounded mr-2" onClick={() => startEditing(todo)}>
                Edit
              </button>
              <button className="p-2 bg-red-500 text-white rounded" onClick={() => deleteTodo(todo._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
