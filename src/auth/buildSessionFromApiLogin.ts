import type { Session, User } from "@supabase/supabase-js";
import type { LoginResponseBody } from "@/api/types/login";

function decodeJwtPayload(
  token: string,
): { sub?: string; exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const segment = parts[1]!;
    const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + "=".repeat(padLen);
    return JSON.parse(atob(base64)) as { sub?: string; exp?: number };
  } catch {
    return null;
  }
}

type ApiLoginTokenPayload = Pick<
  LoginResponseBody,
  "access_token" | "refresh_token" | "token_type"
> & {
  is_admin?: boolean;
  full_name?: string;
};

/** Builds a Supabase-shaped session from fleet API login tokens (JWT claims include `sub`, `exp`). */
export function buildSessionFromApiLogin(
  tokens: ApiLoginTokenPayload,
  email: string,
): Session {
  const payload = decodeJwtPayload(tokens.access_token);
  const now = Math.floor(Date.now() / 1000);
  const exp =
    typeof payload?.exp === "number" && Number.isFinite(payload.exp)
      ? payload.exp
      : now + 3600;
  const sub =
    typeof payload?.sub === "string" && payload.sub.trim()
      ? payload.sub
      : "00000000-0000-4000-8080-000000000000";
  const iso = new Date().toISOString();

  const fullName =
    typeof tokens.full_name === "string" && tokens.full_name.trim()
      ? tokens.full_name.trim()
      : email;
  const isAdmin = tokens.is_admin === true;

  const user: User = {
    id: sub,
    aud: "authenticated",
    role: "authenticated",
    email,
    email_confirmed_at: iso,
    phone: "",
    confirmed_at: iso,
    last_sign_in_at: iso,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {
      full_name: fullName,
      is_admin: isAdmin,
    },
    identities: [],
    created_at: iso,
    updated_at: iso,
    is_anonymous: false,
  };

  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: Math.max(60, exp - now),
    expires_at: exp,
    token_type: tokens.token_type,
    user,
  };
}
