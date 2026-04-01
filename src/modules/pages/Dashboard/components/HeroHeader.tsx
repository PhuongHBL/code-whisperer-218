import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"

export default function HeroHeader() {
  return (
    <Box className="px-8 py-12 bg-surface-container-low">
      <Col className="max-w-7xl mx-auto">
        <Row className="flex-col md:flex-row md:items-end justify-between gap-6">
          <Col className="gap-1">
            {/* Breadcrumb */}
            <Row className="items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">
              <TextPrimary text="Intelligence" className="" />
              <TextPrimary text="chevron_right" className="material-symbols-outlined text-[0.75rem]" />
              <TextPrimary text="Analytics" className="text-primary" />
            </Row>
            <TextPrimary
              text="Price Analytics Dashboard"
              className="text-4xl md:text-5xl font-extrabold tracking-tighter text-primary"
            />
            <TextPrimary
              text="Real-time market volatility and competitor positioning across ANZ regional hubs."
              className="text-on-surface-variant max-w-xl text-sm md:text-base"
            />
          </Col>

          {/* Filters */}
          <Row className="flex-wrap items-center gap-3 bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/10">
            <Col className="px-3 border-r border-outline-variant/20">
              <TextPrimary text="City Hub" className="text-[0.5625rem] uppercase tracking-tighter font-bold text-on-surface-variant/70" />
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0 cursor-pointer outline-none">
                <option>Sydney, AU</option>
                <option>Melbourne, AU</option>
                <option>Auckland, NZ</option>
                <option>Queenstown, NZ</option>
              </select>
            </Col>
            <Col className="px-3 border-r border-outline-variant/20">
              <TextPrimary text="Car Category" className="text-[0.5625rem] uppercase tracking-tighter font-bold text-on-surface-variant/70" />
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0 cursor-pointer outline-none">
                <option>Premium SUV</option>
                <option>Luxury Sedan</option>
                <option>Economy Hatch</option>
                <option>Electric Fleet</option>
              </select>
            </Col>
            <Col className="px-3 pr-4">
              <TextPrimary text="Analysis Window" className="text-[0.5625rem] uppercase tracking-tighter font-bold text-on-surface-variant/70" />
              <Row className="items-center gap-2">
                <TextPrimary text="calendar_month" className="material-symbols-outlined text-sm text-on-surface-variant" />
                <TextPrimary text="Oct 12 - Nov 12" className="text-sm font-semibold text-primary" />
              </Row>
            </Col>
            <BaseButton variant="filled" size="sm" className="p-2.5 rounded-lg">
              <TextPrimary text="tune" className="material-symbols-outlined block" />
            </BaseButton>
          </Row>
        </Row>
      </Col>
    </Box>
  )
}