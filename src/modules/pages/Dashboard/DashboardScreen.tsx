import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TopNavBar from "./components/TopNavBar"
import HeroHeader from "./components/HeroHeader"
import PriceTrendsChart from "./components/PriceTrendsChart"
import FooterBranding from "./components/FooterBranding"

export default function DashboardScreen() {
  const { user, isAuthLoading, signOut } = useAuth()
  const navigate = useNavigate()

  // Redirect to login when not authenticated (after loading)
  const shouldRedirect = !isAuthLoading && !user

  if (shouldRedirect) {
    // Using effect-free redirect via navigate in render is fine for guards
    void Promise.resolve().then(() => navigate("/", { replace: true }))
  }

  return (
    <Col className="dashboard-screen min-h-screen bg-surface text-on-surface">
      {user ? (
        <>
          <TopNavBar user={user} onSignOut={signOut} />
          <Box className="min-h-screen">
            <HeroHeader />
            <Box className="px-8 py-10">
              <Col className="max-w-7xl mx-auto">
                <PriceTrendsChart />
              </Col>
            </Box>
            <FooterBranding />
          </Box>
        </>
      ) : null}
    </Col>
  )
}