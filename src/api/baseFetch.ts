import { getApiAccessToken } from "@/api/authStorage";

/**
 * Central API fetch — aligned with `src/docs/03-api-data-flow.md`, adapted for Vite (`import.meta.env`).
 * Default base matches `src/docs/apiResponse/{dashboardOverview,options,predictMatrix}.md`:
 * `{base}/dashboard/overview`, `{base}/options`, `{base}/predict/matrix`.
 */
const DEFAULT_FLEET_API_BASE = "https://ai.webapp01.hblab.dev/";

export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (typeof base === "string" && base.trim()) {
    return base.replace(/\/$/, "");
  }
  return DEFAULT_FLEET_API_BASE.replace(/\/$/, "");
}

export async function baseFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const root = getApiBaseUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = root ? `${root}${normalized}` : normalized;

  const token = getApiAccessToken();
  return fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
}
