import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Todos from "./Todos";
import "./styles.css";

const basename = import.meta.env.BASE_URL || "/";

if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect !== window.location.href) {
    window.history.replaceState(null, "", redirect);
  }
}

const Root = () => (
  <BrowserRouter basename={basename}>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/todos" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="todos" element={<Todos />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(<Root />);
