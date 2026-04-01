import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"

export default function PriceTrendsChart() {
  return (
    <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
      {/* Header */}
      <Col className="p-4 md:p-6 border-b border-outline-variant/10">
        <Row className="flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Col>
            <TextPrimary text="Price Trends" className="text-lg font-bold text-primary tracking-tight" />
            <TextPrimary text="Historical pricing volatility for SUV Category (30D)" className="text-xs text-on-surface-variant" />
          </Col>
          {/* Company Selector */}
          <Col className="gap-1 min-w-0 sm:min-w-[12.5rem]">
            <TextPrimary text="Compare Companies" className="text-[0.5625rem] uppercase tracking-tighter font-bold text-on-surface-variant/70 px-1" />
            <Box className="relative group">
              <select className="w-full bg-surface-container-low border border-outline-variant/20 rounded-lg py-1.5 pl-3 pr-10 text-xs font-semibold text-primary appearance-none focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer">
                <option>Hertz, Avis, Sixt</option>
                <option>All Competitors</option>
                <option>Hertz</option>
                <option>Avis</option>
                <option>Sixt</option>
                <option>Europcar</option>
                <option>Apex</option>
              </select>
              <TextPrimary text="expand_more" className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-base" />
            </Box>
          </Col>
        </Row>
        {/* Legend */}
        <Row className="flex-wrap gap-2 mt-4">
          <Row className="items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-[0.625rem] font-bold text-primary border border-primary/10">
            <Box className="w-2 h-2 rounded-full bg-primary" />
            <TextPrimary text="Signal" className="" />
          </Row>
          <Row className="items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-[0.625rem] font-bold text-on-surface-variant border border-outline-variant/20">
            <Box className="w-2 h-2 rounded-full bg-secondary" />
            <TextPrimary text="Hertz" className="" />
          </Row>
          <Row className="items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-[0.625rem] font-bold text-on-surface-variant border border-outline-variant/20">
            <Box className="w-2 h-2 rounded-full bg-[hsl(30,89%,67%)]" />
            <TextPrimary text="Avis" className="" />
          </Row>
          <Row className="items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-[0.625rem] font-bold text-on-surface-variant border border-outline-variant/20">
            <Box className="w-2 h-2 rounded-full bg-primary-container" />
            <TextPrimary text="Sixt" className="" />
          </Row>
          <BaseButton variant="bordered" size="sm" className="rounded-full border-dashed border-outline-variant/40 text-[0.625rem] font-bold text-on-surface-variant px-3 py-1">
            <TextPrimary text="add" className="material-symbols-outlined text-[0.75rem]" />
            <TextPrimary text="Add More" className="" />
          </BaseButton>
        </Row>
      </Col>

      {/* Chart Area */}
      <Col className="p-4 md:p-8 flex-1 justify-end min-h-[20rem] md:min-h-[30rem] relative">
        {/* Grid Lines */}
        <Box className="absolute inset-0 p-4 md:p-8 opacity-20">
          <Col className="w-full h-full border-b border-l border-outline-variant/30 justify-between">
            <Box className="w-full border-t border-outline-variant/20" />
            <Box className="w-full border-t border-outline-variant/20" />
            <Box className="w-full border-t border-outline-variant/20" />
            <Box className="w-full border-t border-outline-variant/20" />
            <Box className="w-full border-t border-outline-variant/20" />
          </Col>
        </Box>
        {/* SVG Chart */}
        <svg className="w-full h-56 md:h-80 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <path d="M0,150 Q125,140 250,160 T500,100 T750,120 T1000,40" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" />
          <circle cx="1000" cy="40" fill="hsl(var(--primary))" r="6" />
          <path d="M0,165 Q150,155 300,175 T600,125 T900,135 T1000,110" fill="none" stroke="hsl(var(--secondary))" strokeDasharray="4" strokeWidth="2" />
          <path d="M0,140 Q187,130 375,145 T625,90 T875,100 T1000,60" fill="none" stroke="hsl(30,89%,67%)" strokeWidth="2" />
          <path d="M0,175 Q125,180 250,165 T500,150 T750,160 T1000,140" fill="none" stroke="hsl(var(--primary-container))" strokeWidth="2" />
        </svg>
        <Row className="justify-between mt-6 md:mt-10 text-[0.5rem] md:text-[0.625rem] font-bold text-on-surface-variant/60 tracking-widest uppercase">
          <TextPrimary text="Oct 12" className="" />
          <TextPrimary text="Oct 19" className="" />
          <TextPrimary text="Oct 26" className="" />
          <TextPrimary text="Nov 02" className="" />
          <TextPrimary text="Nov 09" className="hidden sm:block" />
          <TextPrimary text="Nov 12" className="" />
        </Row>
      </Col>
    </Col>
  )
}
