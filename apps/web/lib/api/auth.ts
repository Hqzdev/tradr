import { apiFetch } from "@/lib/api/client";

const ACCESS_TOKEN_KEY = "tradr_access_token";
const REFRESH_TOKEN_KEY = "tradr_refresh_token";
const USER_KEY = "tradr_user";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  firstAgentId?: string | null;
}

export interface FirstAgentRegistration {
  name: string;
  strategy: "careful" | "aggressive" | "random";
  budgetLimit: number;
}

export interface RegistrationInput {
  email: string;
  password: string;
  displayName: string;
  firstAgent: FirstAgentRegistration;
}

export interface RegistrationResult {
  user: AuthUser;
  firstAgentId: string | null;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveSession(response);
  return response.user;
}

export async function register(input: RegistrationInput): Promise<RegistrationResult> {
  const response = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  saveSession(response);
  return { user: response.user, firstAgentId: response.firstAgentId ?? null };
}

export async function currentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}

export function savedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(ACCESS_TOKEN_KEY));
}

export async function logout(): Promise<void> {
  const refreshToken = typeof window === "undefined" ? null : window.localStorage.getItem(REFRESH_TOKEN_KEY);
  try {
    if (refreshToken) {
      await apiFetch<void>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    }
  } finally {
    clearSession();
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function saveSession(response: AuthResponse): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}
