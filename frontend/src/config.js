const STORAGE_KEY = "todo_api_base_url";

function normalize(url) {
  if (!url) return "";
  return url.replace(/\s+/g, "").replace(/\/+$/, "");
}

function readQueryOverride() {
  if (typeof window === "undefined") return "";
  try {
    const params = new URL(window.location.href).searchParams;
    const value = params.get("api");
    return value ? normalize(value) : "";
  } catch {
    return "";
  }
}

function readStoredOverride() {
  if (typeof window === "undefined") return "";
  return normalize(localStorage.getItem(STORAGE_KEY) || "");
}

function runtimeConfigUrl() {
  if (typeof window === "undefined") return "";
  const config = window.__TODO_APP_CONFIG__;
  return config && config.apiBaseUrl ? normalize(config.apiBaseUrl) : "";
}

function envUrl() {
  if (typeof import.meta === "undefined") return "";
  const value = import.meta.env?.VITE_API_URL;
  return value ? normalize(value) : "";
}

export function getApiBase() {
  const query = readQueryOverride();
  if (query) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, query);
    }
    return query;
  }

  const stored = readStoredOverride();
  if (stored) return stored;

  const runtime = runtimeConfigUrl();
  if (runtime) return runtime;

  const env = envUrl();
  if (env) return env;

  if (typeof window !== "undefined" && !window.location.hostname.endsWith("github.io")) {
    return "http://localhost:8080";
  }

  return "";
}

export function updateApiBase(url) {
  if (typeof window === "undefined") return;
  const value = normalize(url);
  if (value) {
    localStorage.setItem(STORAGE_KEY, value);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.location.reload();
}


