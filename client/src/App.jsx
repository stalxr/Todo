import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="logo">Todo App</h1>
        <nav className="nav-links">
          {token ? (
            <>
              <Link to="/todos" className="nav-link">
                Задачи
              </Link>
              <button onClick={logout} className="link-button nav-primary">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Войти
              </Link>
              <Link to="/register" className="nav-link nav-primary">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
