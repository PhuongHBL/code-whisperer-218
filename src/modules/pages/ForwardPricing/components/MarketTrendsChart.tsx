import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"

export default function MarketTrendsChart() {
  return (
    <Box className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-md ring-1 ring-outline-variant/10">
      <Col className="p-8 h-[450px] relative">
        {/* Grid lines */}
        <Col className="absolute inset-x-8 inset-y-12 justify-between opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <Box key={i} className="w-full border-b border-primary/20 h-px" />
          ))}
        </Col>
        <Col className="relative h-full w-full justify-center items-center">
          <svg className="w-full h-full max-w-5xl overflow-visible" viewBox="0 0 1000 250">
            <defs>
              <linearGradient id="gradient-forward" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary-container))" stopOpacity="0.1" />
                <stop offset="100%" stopColor="hsl(var(--primary-container))" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110" fill="url(#gradient-forward)" stroke="none" />
            <path d="M0,180 Q100,150 200,190 T400,120 T600,170 T800,80 T1000,110" fill="none" stroke="hsl(var(--primary-container))" strokeLinecap="round" strokeWidth="4" />
            <path d="M0,200 Q100,170 200,210 T400,140 T600,190 T800,100 T1000,130" fill="none" stroke="hsl(var(--secondary))" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="2" />
            <circle className="animate-pulse" cx="800" cy="80" fill="hsl(var(--primary-container))" r="6" />
            <text className="text-[12px] font-black" fill="hsl(var(--primary))" x="810" y="70">$142.50 Peak</text>
          </svg>
          <Row className="gap-12 mt-12">
            <Row className="items-center gap-3 bg-primary/5 px-4 py-2 rounded-full">
              <Box className="w-3 h-3 bg-primary rounded-full" />
              <TextPrimary text="Our Fleet Pricing" className="text-xs font-bold text-primary" />
            </Row>
            <Row className="items-center gap-3 bg-secondary/5 px-4 py-2 rounded-full">
              <Box className="w-3 h-3 bg-secondary rounded-full" />
              <TextPrimary text="Market Benchmark Avg" className="text-xs font-bold text-secondary" />
            </Row>
          </Row>
        </Col>
      </Col>
    </Box>
  )
}
