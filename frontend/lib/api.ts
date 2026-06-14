import { getToken, clearAuth } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = RequestInit & { auth?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...fetchOptions } = options;
  const token = getToken();

  const headers: Record<string, string> = {
    ...(fetchOptions.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && auth && typeof window !== "undefined") {
      clearAuth();
      window.location.href = "/login";
    }
    throw new ApiClientError(data.message || "Request failed", res.status, data.details);
  }

  return data;
}

export const api = {
  get: <T>(path: string) => request<{ success: boolean; data: T }>(path).then((r) => r.data),
  post: <T>(path: string, body: unknown, auth = true) =>
    request<{ success: boolean; data: T }>(path, {
      method: "POST",
      body: JSON.stringify(body),
      auth,
    }).then((r) => r.data),
  put: <T>(path: string, body: unknown) =>
    request<{ success: boolean; data: T }>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }).then((r) => r.data),
  delete: async (path: string) =>
    request<{ success: boolean; message?: string }>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    request<{ success: boolean; data: T; message?: string }>(path, {
      method: "POST",
      body: formData,
    }),
};
