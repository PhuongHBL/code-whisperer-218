import { useCallback, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function useAuth() {
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let isMounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setIsAuthLoading(false)
    })

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      setIsAuthLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Sign out failed. Please try again.")
      throw error
    }
    toast.success("Signed out successfully.")
  }, [])

  const user: User | null = session?.user ?? null

  return { isAuthLoading, session, user, signOut }
}