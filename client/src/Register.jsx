import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "./api.js";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await register(email.trim(), password);
      const loginResult = await login(email.trim(), password);
      if (loginResult.error) {
        setMsg("Регистрация успешна, но не удалось войти. Попробуйте войти вручную.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      if (loginResult.token) {
        localStorage.setItem("token", loginResult.token);
        navigate("/todos", { replace: true });
      } else {
        setMsg("Регистрация успешна, но не удалось получить токен. Попробуйте войти вручную.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (e) {
      setMsg(e?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Создать аккаунт</h2>
        <p className="card-subtitle">
          Заполните форму, чтобы начать вести список своих задач.
        </p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <label htmlFor="register-password">Пароль</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Минимум 6 символов"
        />

        <button type="submit">Создать аккаунт</button>
      </form>

      {msg && <div className="info">{msg}</div>}

      <div className="card-footer">
        <span>Уже есть аккаунт?</span>
        <Link to="/login" className="inline-link">
          Войти
        </Link>
      </div>
    </div>
  );
}
