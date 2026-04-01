import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { lovable } from "@/integrations/lovable"
import { toast } from "sonner"

const DEV_FAKE_AUTH_KEY = "signal_dev_fake_auth"

function buildDevFakeSession(): Session {
  const now = Math.floor(Date.now() / 1000)
  const iso = new Date().toISOString()
  const user: User = {
    id: "00000000-0000-4000-8000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "demo@local.dev",
    email_confirmed_at: iso,
    phone: "",
    confirmed_at: iso,
    last_sign_in_at: iso,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Demo User" },
    identities: [],
    created_at: iso,
    updated_at: iso,
    is_anonymous: false,
  }
  return {
    access_token: "dev-fake-access-token",
    refresh_token: "dev-fake-refresh-token",
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: "bearer",
    user,
  }
}

type AuthContextValue = {
  isAuthLoading: boolean
  session: Session | null
  user: User | null
  signInWithGoogle: () => Promise<void>
  signInWithDevDemo: () => void
  signOut: () => Promise<void>
  /** Only `true` in Vite dev — show a local demo sign-in without Supabase. */
  isDevDemoLoginAvailable: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [realSession, setRealSession] = useState<Session | null>(null)
  const [devFakeSession, setDevFakeSession] = useState<Session | null>(null)

  const isDevDemoLoginAvailable = import.meta.env.DEV

  useEffect(() => {
    let isMounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setRealSession(nextSession)
      if (nextSession) {
        setDevFakeSession(null)
        sessionStorage.removeItem(DEV_FAKE_AUTH_KEY)
      }
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setRealSession(data.session)
      if (
        !data.session &&
        import.meta.env.DEV &&
        sessionStorage.getItem(DEV_FAKE_AUTH_KEY) === "1"
      ) {
        setDevFakeSession(buildDevFakeSession())
      }
      setIsAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const session = devFakeSession ?? realSession
  const user = session?.user ?? null

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
      extraParams: {
        prompt: "select_account",
      },
    })
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.")
      throw result.error
    }
    if (result.redirected) {
      return
    }
    toast.success("Signed in successfully.")
  }, [])

  const signInWithDevDemo = useCallback(() => {
    if (!import.meta.env.DEV) return
    setDevFakeSession(buildDevFakeSession())
    sessionStorage.setItem(DEV_FAKE_AUTH_KEY, "1")
    toast.success("Signed in as demo user (local dev only).")
  }, [])

  const signOut = useCallback(async () => {
    if (devFakeSession) {
      setDevFakeSession(null)
      sessionStorage.removeItem(DEV_FAKE_AUTH_KEY)
      toast.success("Signed out successfully.")
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Sign out failed. Please try again.")
      throw error
    }
    toast.success("Signed out successfully.")
  }, [devFakeSession])

  const value = useMemo(
    () => ({
      isAuthLoading,
      session,
      user,
      signInWithGoogle,
      signInWithDevDemo,
      signOut,
      isDevDemoLoginAvailable,
    }),
    [
      isAuthLoading,
      session,
      user,
      signInWithGoogle,
      signInWithDevDemo,
      signOut,
      isDevDemoLoginAvailable,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
