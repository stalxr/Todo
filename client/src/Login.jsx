import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Пожалуйста, заполните email и пароль.");
      return;
    }

    try {
      const res = await login(email.trim(), password);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        navigate("/todos");
        return;
      }

      if (res?.error) {
        setErr(res.error);
        return;
      }

      setErr("Не удалось войти. Повторите попытку позже.");
    } catch (e) {
      if (typeof e === "string") setErr(e);
      else if (e?.message) setErr(e.message);
      else setErr("Сервер недоступен. Проверьте соединение.");
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Войти в аккаунт</h2>
        <p className="card-subtitle">
          Авторизуйтесь, чтобы увидеть свои задачи и управлять ими.
        </p>
      </div>
      <form onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="you@example.com"
        />
        <label htmlFor="login-password">Пароль</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <button type="submit">Войти</button>
      </form>

      {err && (
        <div className="error" role="alert">
          {err}
        </div>
      )}

      <div className="card-footer">
        <span>Нет аккаунта?</span>
        <Link to="/register" className="inline-link">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}
