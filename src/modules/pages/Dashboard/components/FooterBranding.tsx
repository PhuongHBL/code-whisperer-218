import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import TextPrimary from "@/modules/common/components/TextPrimary"

export default function FooterBranding() {
  return (
    <Row className="max-w-7xl mx-auto px-8 py-12 border-t border-outline-variant/10 justify-center items-center">
      <Col className="gap-1 items-center">
        <TextPrimary text="Signal" className="text-lg font-bold tracking-tighter text-primary" />
        <TextPrimary text="Fleet Intelligence & Analytics Platform © 2023" className="text-xs text-on-surface-variant" />
      </Col>
    </Row>
  )
}