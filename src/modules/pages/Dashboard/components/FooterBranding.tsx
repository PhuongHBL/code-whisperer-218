import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import TextPrimary from "@/modules/common/components/TextPrimary"

export default function FooterBranding() {
  return (
    <Row className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-10 md:py-12 border-t border-outline-variant/10 flex-col md:flex-row justify-between items-center md:items-start gap-6">
      <Col className="gap-1 items-center md:items-start">
        <TextPrimary text="Signal" className="text-lg font-bold tracking-tighter text-primary" />
        <TextPrimary text="Fleet Intelligence & Analytics Platform © 2023" className="text-xs text-on-surface-variant" />
      </Col>
      <Row className="gap-6 md:gap-8">
        <a className="text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          Privacy Policy
        </a>
        <a className="text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          Terms of Service
        </a>
        <a className="text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          Support
        </a>
      </Row>
    </Row>
  )
}
