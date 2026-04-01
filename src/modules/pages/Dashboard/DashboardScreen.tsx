import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TopNavBar from "./components/TopNavBar"
import HeroHeader from "./components/HeroHeader"
import DashboardPriceTrendsSection from "./components/DashboardPriceTrendsSection"
import { FleetFiltersProvider } from "./FleetFiltersContext"

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
          <FleetFiltersProvider>
            <Col className="flex-1">
              <HeroHeader />
              <Box className="px-2.5 md:px-4 lg:px-5 py-2 md:py-3 lg:py-4">
                <Col className="max-w-7xl mx-auto">
                  <DashboardPriceTrendsSection />
                </Col>
              </Box>
            </Col>
          </FleetFiltersProvider>
        </>
      ) : null}
    </Col>
  )
}
