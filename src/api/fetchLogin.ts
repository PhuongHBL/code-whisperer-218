import { getAuthApiBaseUrl } from "@/api/authApiBase"
import type { LoginRequestBody, LoginResponseBody } from "@/api/types/login"

function parseErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback
  const o = json as Record<string, unknown>
  if (typeof o.message === "string") return o.message
  const detail = o.detail
  if (typeof detail === "string") return detail
  if (Array.isArray(detail) && detail[0] && typeof detail[0] === "object") {
    const first = detail[0] as { msg?: string }
    if (typeof first.msg === "string") return first.msg
  }
  return fallback
}

function isLoginResponse(json: unknown): json is LoginResponseBody {
  if (!json || typeof json !== "object") return false
  const o = json as Record<string, unknown>
  return (
    typeof o.access_token === "string" &&
    typeof o.refresh_token === "string" &&
    typeof o.token_type === "string" &&
    typeof o.is_admin === "boolean" &&
    typeof o.full_name === "string"
  )
}

/**
 * POST `/api/v1/auth/login` — see `src/docs/apiResponse/login.md`.
 */
export async function fetchLogin(
  body: LoginRequestBody,
): Promise<LoginResponseBody> {
  const root = getAuthApiBaseUrl()
  const url = `${root}/api/v1/auth/login`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const json: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(
      parseErrorMessage(json, res.statusText || `Login failed (${res.status})`),
    )
  }

  if (!isLoginResponse(json)) {
    throw new Error("Invalid login response")
  }

  return json
}
