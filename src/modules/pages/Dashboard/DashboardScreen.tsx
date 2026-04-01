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

  const shouldRedirect = !isAuthLoading && !user

  if (shouldRedirect) {
    void Promise.resolve().then(() => navigate("/", { replace: true }))
  }

  return (
    <Col className="dashboard-screen min-h-screen bg-surface text-on-surface">
      {user ? (
        <>
          <TopNavBar user={user} onSignOut={signOut} />
          <Col className="flex-1">
            <HeroHeader />
            <Box className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
              <Col className="max-w-7xl mx-auto">
                <PriceTrendsChart />
              </Col>
            </Box>
            <FooterBranding />
          </Col>
        </>
      ) : null}
    </Col>
  )
}
