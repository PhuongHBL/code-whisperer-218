/** Auth service host (login, refresh, …) — see `src/docs/apiResponse/login.md`. */
const DEFAULT_AUTH_API_BASE = "http://172.16.52.27:8080";

export function getAuthApiBaseUrl(): string {
  const base = import.meta.env.VITE_AUTH_API_BASE_URL;
  if (typeof base === "string" && base.trim()) {
    return base.replace(/\/$/, "");
  }
  return DEFAULT_AUTH_API_BASE;
}
