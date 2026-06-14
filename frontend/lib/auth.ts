const TOKEN_KEY = "system_auto_token";
const USER_KEY = "system_auto_user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

type AuthListener = () => void;
const listeners = new Set<AuthListener>();

function notifyAuthChange() {
  listeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: AuthListener) {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY || event.key === USER_KEY) {
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

export function isAuthenticated() {
  return !!getToken();
}

export function getAuthSnapshot() {
  return isAuthenticated();
}

export function getAuthServerSnapshot() {
  return false;
}

export function getClientMountedSnapshot() {
  return true;
}

export function getServerMountedSnapshot() {
  return false;
}
