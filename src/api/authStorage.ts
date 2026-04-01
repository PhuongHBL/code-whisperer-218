import type { LoginResponseBody } from "@/api/types/login"

const API_AUTH_STORAGE_KEY = "signal_api_auth"

/** Persisted login; `is_admin` / `full_name` may be absent for older sessionStorage entries. */
export type StoredApiAuth = Pick<
  LoginResponseBody,
  "access_token" | "refresh_token" | "token_type"
> & {
  email: string
  is_admin?: boolean
  full_name?: string
}

export function saveApiAuth(data: StoredApiAuth): void {
  sessionStorage.setItem(API_AUTH_STORAGE_KEY, JSON.stringify(data))
}

export function loadApiAuth(): StoredApiAuth | null {
  try {
    const raw = sessionStorage.getItem(API_AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof (parsed as StoredApiAuth).access_token !== "string" ||
      typeof (parsed as StoredApiAuth).refresh_token !== "string" ||
      typeof (parsed as StoredApiAuth).email !== "string"
    ) {
      return null
    }
    return parsed as StoredApiAuth
  } catch {
    return null
  }
}

export function clearApiAuth(): void {
  sessionStorage.removeItem(API_AUTH_STORAGE_KEY)
}

/** Access token for `Authorization` on fleet API requests, if logged in via email/password. */
export function getApiAccessToken(): string | null {
  const s = loadApiAuth()
  if (!s?.access_token) return null
  const exp = getJwtExp(s.access_token)
  if (exp != null && exp <= Math.floor(Date.now() / 1000)) {
    clearApiAuth()
    return null
  }
  return s.access_token
}

function getJwtExp(token: string): number | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const json = base64UrlDecode(parts[1]!)
    const payload = JSON.parse(json) as { exp?: unknown }
    return typeof payload.exp === "number" ? payload.exp : null
  } catch {
    return null
  }
}

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/")
  const padLen = (4 - (padded.length % 4)) % 4
  const base64 = padded + "=".repeat(padLen)
  return atob(base64)
}
