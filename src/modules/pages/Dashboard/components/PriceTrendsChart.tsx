import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import BaseButton from "@/modules/common/components/BaseButton"

export default function PriceTrendsChart() {
  return (
    <Col className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 overflow-hidden">
      {/* Header */}
      <Col className="p-5 md:p-6 lg:p-8 border-b border-outline-variant/10 gap-4">
        <Row className="flex-col sm:flex-row sm:items-start justify-between gap-4">
          <Col className="gap-0.5">
            <TextPrimary text="Price Trends" className="text-base md:text-lg font-bold text-primary tracking-tight" />
            <TextPrimary text="Historical pricing volatility for SUV Category (30D)" className="text-xs text-on-surface-variant" />
          </Col>
          {/* Company Selector */}
          <Col className="gap-1 w-full sm:w-auto sm:min-w-[12rem]">
            <TextPrimary text="Compare Companies" className="text-[0.5625rem] uppercase tracking-wider font-bold text-on-surface-variant/60 px-1" />
            <Box className="relative">
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
        <Row className="flex-wrap gap-2">
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
      <Col className="p-5 md:p-6 lg:p-8 flex-1 justify-end min-h-[18rem] sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem] relative">
        {/* Grid Lines */}
        <Box className="absolute inset-0 p-5 md:p-6 lg:p-8 opacity-15 pointer-events-none">
          <Col className="w-full h-full border-b border-l border-outline-variant/30 justify-between">
            {[...Array(5)].map((_, i) => (
              <Box key={i} className="w-full border-t border-outline-variant/20" />
            ))}
          </Col>
        </Box>
        {/* SVG Chart — thicker, more prominent curves to match reference */}
        <svg className="w-full h-48 sm:h-56 md:h-64 lg:h-80 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
          {/* Signal (main bold line) */}
          <path d="M0,160 C80,155 160,145 240,150 C320,155 380,170 460,130 C540,90 600,60 680,55 C760,50 820,70 880,40 C920,25 960,20 1000,15" fill="none" stroke="hsl(var(--primary))" strokeWidth="5" strokeLinecap="round" />
          <circle cx="1000" cy="15" fill="hsl(var(--primary))" r="7" className="animate-pulse" />
          {/* Hertz (dashed) */}
          <path d="M0,170 C100,175 180,180 280,165 C380,150 440,130 520,110 C600,90 680,75 740,85 C800,95 860,120 920,105 C960,95 980,90 1000,85" fill="none" stroke="hsl(var(--secondary))" strokeDasharray="8 5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Avis (solid orange) */}
          <path d="M0,145 C100,150 180,160 280,155 C380,150 440,120 520,100 C600,80 660,95 720,110 C780,125 840,140 900,125 C940,115 970,100 1000,95" fill="none" stroke="hsl(30,89%,67%)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sixt (thin dark) */}
          <path d="M0,180 C120,182 200,178 300,175 C400,172 480,165 560,160 C640,155 720,150 800,148 C880,146 940,142 1000,140" fill="none" stroke="hsl(var(--primary-container))" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <Row className="justify-between mt-6 md:mt-8 lg:mt-10 text-[0.5625rem] md:text-[0.625rem] font-bold text-on-surface-variant/50 tracking-widest uppercase">
          <TextPrimary text="Oct 12" className="" />
          <TextPrimary text="Oct 19" className="" />
          <TextPrimary text="Oct 26" className="" />
          <TextPrimary text="Nov 02" className="" />
          <TextPrimary text="Nov 09" className="" />
          <TextPrimary text="Nov 12" className="" />
        </Row>
      </Col>
    </Col>
  )
}
