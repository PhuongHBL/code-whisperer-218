import type { User } from "@supabase/supabase-js"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Col from "@/modules/common/components/Col"
import TextPrimary from "@/modules/common/components/TextPrimary"
import DashboardScreen from "@/modules/pages/Dashboard/DashboardScreen"
import LoginScreen from "@/modules/pages/Login/LoginScreen"

function isUserAdmin(user: User) {
  return user.user_metadata?.is_admin === true
}

export default function Index() {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <Col className="min-h-screen bg-surface items-center justify-center">
        <TextPrimary
          text="Checking session…"
          className="text-sm text-on-surface-variant"
        />
      </Col>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  if (!isUserAdmin(user)) {
    return <Navigate to="/forward-pricing" replace />
  }

  return <DashboardScreen />
}
