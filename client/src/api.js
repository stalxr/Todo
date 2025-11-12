import { getApiBase } from "./config";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildUrl(path) {
  const base = getApiBase();
  if (!base) throw new Error("Не задан адрес API");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

async function request(path, options, defaultMessage) {
  const response = await fetch(buildUrl(path), options);
  if (response.status === 401) throw new Error("Не авторизован");
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || defaultMessage);
  return data;
}

export async function register(email, password) {
  return request(
    "/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
    "Ошибка регистрации",
  );
}

export async function login(email, password) {
  try {
    return await request(
      "/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
      "Ошибка авторизации",
    );
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Ошибка авторизации" };
  }
}

export async function getTodos() {
  return request(
    "/todos",
    {
      headers: { ...authHeaders() },
    },
    "Не удалось получить задачи",
  );
}

export async function createTodo(title) {
  return request(
    "/todos",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ title }),
    },
    "Не удалось создать задачу",
  );
}

export async function updateTodo(id, body) {
  return request(
    `/todos/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    },
    "Не удалось обновить задачу",
  );
}

export async function deleteTodo(id) {
  await request(
    `/todos/${id}`,
    {
      method: "DELETE",
      headers: { ...authHeaders() },
    },
    "Не удалось удалить задачу",
  );
  return true;
}
