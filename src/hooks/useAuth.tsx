import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { clearApiAuth, loadApiAuth, saveApiAuth } from "@/api/authStorage";
import { fetchLogin } from "@/api/fetchLogin";
import { buildSessionFromApiLogin } from "@/auth/buildSessionFromApiLogin";

const DEV_FAKE_AUTH_KEY = "signal_dev_fake_auth";

function buildDevFakeSession(): Session {
  const now = Math.floor(Date.now() / 1000);
  const iso = new Date().toISOString();
  const user: User = {
    id: "00000000-0000-4000-8080-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "demo@local.dev",
    email_confirmed_at: iso,
    phone: "",
    confirmed_at: iso,
    last_sign_in_at: iso,
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: { full_name: "Demo User", is_admin: true },
    identities: [],
    created_at: iso,
    updated_at: iso,
    is_anonymous: false,
  };
  return {
    access_token: "dev-fake-access-token",
    refresh_token: "dev-fake-refresh-token",
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: "bearer",
    user,
  };
}

type AuthContextValue = {
  isAuthLoading: boolean;
  session: Session | null;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInWithDevDemo: () => void;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Only `true` in Vite dev — show a local demo sign-in without Supabase. */
  isDevDemoLoginAvailable: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function tryRestoreApiSession(): Session | null {
  const stored = loadApiAuth();
  if (!stored) return null;
  try {
    const session = buildSessionFromApiLogin(
      {
        access_token: stored.access_token,
        refresh_token: stored.refresh_token,
        token_type: stored.token_type,
        is_admin: stored.is_admin,
        full_name: stored.full_name,
      },
      stored.email,
    );
    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at != null && session.expires_at <= now) {
      clearApiAuth();
      return null;
    }
    return session;
  } catch {
    clearApiAuth();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [realSession, setRealSession] = useState<Session | null>(null);
  const [devFakeSession, setDevFakeSession] = useState<Session | null>(null);
  const [apiPasswordSession, setApiPasswordSession] = useState<Session | null>(
    null,
  );

  const isDevDemoLoginAvailable = import.meta.env.DEV;

  useEffect(() => {
    let isMounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setRealSession(nextSession);
      if (nextSession) {
        setDevFakeSession(null);
        sessionStorage.removeItem(DEV_FAKE_AUTH_KEY);
        clearApiAuth();
        setApiPasswordSession(null);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setRealSession(data.session);
      if (data.session) {
        setIsAuthLoading(false);
        return;
      }
      const apiSession = tryRestoreApiSession();
      if (apiSession) {
        setApiPasswordSession(apiSession);
      } else if (
        import.meta.env.DEV &&
        sessionStorage.getItem(DEV_FAKE_AUTH_KEY) === "1"
      ) {
        setDevFakeSession(buildDevFakeSession());
      }
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const session = devFakeSession ?? apiPasswordSession ?? realSession;
  const user = session?.user ?? null;

  const signInWithGoogle = useCallback(async () => {
    const redirectTo = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      throw error;
    }
    if (data.url) {
      window.location.assign(data.url);
      return;
    }
    toast.error(
      "Google sign-in could not start. Check your Supabase Auth settings.",
    );
  }, []);

  const signInWithDevDemo = useCallback(() => {
    if (!import.meta.env.DEV) return;
    clearApiAuth();
    setApiPasswordSession(null);
    setDevFakeSession(buildDevFakeSession());
    sessionStorage.setItem(DEV_FAKE_AUTH_KEY, "1");
    toast.success("Signed in as demo user (local dev only).");
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      try {
        const tokens = await fetchLogin({ email, password });
        await supabase.auth.signOut();
        setDevFakeSession(null);
        sessionStorage.removeItem(DEV_FAKE_AUTH_KEY);
        saveApiAuth({ ...tokens, email });
        setApiPasswordSession(buildSessionFromApiLogin(tokens, email));
        toast.success("Signed in successfully.");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Sign in failed.";
        toast.error(msg);
        throw e;
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (apiPasswordSession) {
      clearApiAuth();
      setApiPasswordSession(null);
      toast.success("Signed out successfully.");
      return;
    }
    if (devFakeSession) {
      setDevFakeSession(null);
      sessionStorage.removeItem(DEV_FAKE_AUTH_KEY);
      toast.success("Signed out successfully.");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed. Please try again.");
      throw error;
    }
    toast.success("Signed out successfully.");
  }, [apiPasswordSession, devFakeSession]);

  const value = useMemo(
    () => ({
      isAuthLoading,
      session,
      user,
      signInWithGoogle,
      signInWithDevDemo,
      signInWithPassword,
      signOut,
      isDevDemoLoginAvailable,
    }),
    [
      isAuthLoading,
      session,
      user,
      signInWithGoogle,
      signInWithDevDemo,
      signInWithPassword,
      signOut,
      isDevDemoLoginAvailable,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
