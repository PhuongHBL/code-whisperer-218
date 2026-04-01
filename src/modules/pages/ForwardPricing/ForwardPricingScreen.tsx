import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"
import TopNavBar from "@/modules/pages/Dashboard/components/TopNavBar"
import FooterBranding from "@/modules/pages/Dashboard/components/FooterBranding"
import SummaryCards from "./components/SummaryCards"
import SearchFilters from "./components/SearchFilters"
import PriceCalendar from "./components/PriceCalendar"
import MarketTrendsChart from "./components/MarketTrendsChart"
import CompetitorsTable from "./components/CompetitorsTable"

export default function ForwardPricingScreen() {
  const { user, isAuthLoading, signOut } = useAuth()
  const navigate = useNavigate()

  if (!isAuthLoading && !user) {
    void Promise.resolve().then(() => navigate("/", { replace: true }))
  }

  return (
    <Col className="min-h-screen bg-surface text-on-surface">
      {user ? (
        <>
          <TopNavBar user={user} onSignOut={signOut} />
          <Box className="min-h-screen">
            <Col className="p-4 md:p-8 pt-4 md:pt-6 gap-6 md:gap-8 max-w-[1400px] mx-auto w-full">
              {/* Page header */}
              <Row className="flex-col md:flex-row justify-between md:items-end gap-4">
                <Col className="gap-1">
                  <Row className="items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
                    <TextPrimary text="Intelligence" className="" />
                    <TextPrimary text="chevron_right" className="material-symbols-outlined text-[0.75rem]" />
                    <TextPrimary text="Market Pricing" className="text-primary" />
                  </Row>
                  <TextPrimary text="Forward Market Pricing" className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-primary" />
                  <TextPrimary text="Comprehensive competitor rate monitoring and market volatility analysis." className="text-sm text-on-surface-variant max-w-xl" />
                </Col>
                <BaseButton variant="filled" size="md" className="bg-primary-container hover:opacity-95 shadow-lg shadow-primary/20 gap-2 self-start md:self-auto">
                  <TextPrimary text="analytics" className="material-symbols-outlined text-sm" />
                  <TextPrimary text="Refresh Monitoring" className="" />
                </BaseButton>
              </Row>

              <SummaryCards />
              <SearchFilters />
              <PriceCalendar />
              <MarketTrendsChart />
              <CompetitorsTable />
            </Col>
            <FooterBranding />
          </Box>
        </>
      ) : null}
    </Col>
  )
}
