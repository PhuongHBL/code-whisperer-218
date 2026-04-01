import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"

export default function HeroHeader() {
  return (
    <Box className="px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-14 bg-surface-container-low">
      <Row className="max-w-7xl mx-auto flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
        <Col className="gap-2 flex-1">
          {/* Breadcrumb */}
          <Row className="items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">
            <TextPrimary text="Intelligence" className="" />
            <TextPrimary text="chevron_right" className="material-symbols-outlined text-[0.75rem]" />
            <TextPrimary text="Analytics" className="text-primary" />
          </Row>
          <TextPrimary
            text="Price Analytics Dashboard"
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-black tracking-tighter text-primary leading-tight"
          />
          <TextPrimary
            text="Real-time market volatility and competitor positioning across ANZ regional hubs."
            className="text-on-surface-variant max-w-lg text-sm md:text-[0.9375rem]"
          />
        </Col>

        {/* Filters bar */}
        <Row className="items-center gap-0 bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/10 shrink-0">
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[130px]">
            <TextPrimary text="City Hub" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <Row className="items-center gap-1">
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-primary focus:ring-0 cursor-pointer outline-none">
                <option>Sydney, AU</option>
                <option>Melbourne, AU</option>
                <option>Auckland, NZ</option>
                <option>Queenstown, NZ</option>
              </select>
            </Row>
          </Col>
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[130px]">
            <TextPrimary text="Car Category" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <TextPrimary text="Premium SUV" className="text-sm font-semibold text-primary" />
          </Col>
          <Col className="px-4 py-3 border-r border-outline-variant/15 min-w-[150px]">
            <TextPrimary text="Analysis Window" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60" />
            <Row className="items-center gap-2">
              <TextPrimary text="calendar_month" className="material-symbols-outlined text-sm text-on-surface-variant" />
              <TextPrimary text="Oct 12 - Nov 12" className="text-sm font-semibold text-primary" />
            </Row>
          </Col>
          <BaseButton variant="filled" size="sm" className="m-2 p-3 rounded-lg">
            <TextPrimary text="tune" className="material-symbols-outlined block" />
          </BaseButton>
        </Row>
      </Row>
    </Box>
  )
}
