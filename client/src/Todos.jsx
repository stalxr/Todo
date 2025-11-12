import React, { useEffect, useState } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    load();
  }, []);

  async function load() {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr(null);
    try {
      const todo = await createTodo(title);
      setTitle("");
      setTodos(prev => [...prev, todo]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  async function onToggle(todo) {
    try {
      const updated = await updateTodo(todo.ID, { is_done: !todo.IsDone });
      setTodos(prev => prev.map(t => (t.ID === updated.ID ? updated : t)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  async function onEdit(todo) {
    const newTitle = prompt("New title", todo.Title);
    if (!newTitle) return;
    try {
      const updated = await updateTodo(todo.ID, { title: newTitle });
      setTodos(prev => prev.map(t => (t.ID === updated.ID ? updated : t)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete?")) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.ID !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="card">
      <h2>Your Todos</h2>
      <form onSubmit={onCreate} className="row">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo" required />
        <button type="submit">Add</button>
      </form>

      {err && <div className="error">{err}</div>}

      <ul className="list">
        {todos.map(t => (
          <li key={t.ID} className={t.IsDone ? "done" : ""}>
            <input type="checkbox" checked={t.IsDone} onChange={() => onToggle(t)} />
            <span className="title">{t.Title}</span>
            <div className="actions">
              <button onClick={() => onEdit(t)}>Edit</button>
              <button onClick={() => onDelete(t.ID)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
