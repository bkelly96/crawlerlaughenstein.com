import { apiFetch, setToken, clearToken } from "./client";
import type { User } from "../types/user";

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(username: string, password: string): Promise<User> {
  const { token, user } = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  setToken(token);
  return user;
}

export function logout(): void {
  clearToken();
}

export function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}
