import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Register from "./Register";
import Todos from "./Todos";
import "./styles.css";

const Root = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL ?? "/"}>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="todos" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="todos" element={<Todos />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")).render(<Root />);
