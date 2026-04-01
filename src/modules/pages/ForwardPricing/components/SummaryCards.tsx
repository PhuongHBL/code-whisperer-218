import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import TextPrimary from "@/modules/common/components/TextPrimary"

interface StatCard {
  label: string
  value: string
  badge: string
  badgeColor: string
  borderColor: string
}

const stats: StatCard[] = [
  { label: "Total Fleet Analyzed", value: "12,480", badge: "+4.2%", badgeColor: "text-green-600", borderColor: "border-primary" },
  { label: "Avg Daily Rate (Market)", value: "$94.50", badge: "+$2.15", badgeColor: "text-destructive", borderColor: "border-surface-tint" },
  { label: "Top Demand Hub", value: "SYD Airport", badge: "trending_up", badgeColor: "text-secondary", borderColor: "border-secondary" },
  { label: "Lowest Rate Found", value: "$58.00", badge: "BNE Inner", badgeColor: "text-on-surface-variant", borderColor: "border-outline-variant" },
]

export default function SummaryCards() {
  return (
    <Row className="flex-col md:flex-row gap-4">
      {stats.map((s) => (
        <Col key={s.label} className={`flex-1 bg-surface-container-lowest p-5 rounded-lg shadow-sm border-l-4 ${s.borderColor}`}>
          <TextPrimary text={s.label} className="text-[0.625rem] font-black uppercase tracking-widest text-on-surface-variant mb-1" />
          <Row className="items-end gap-2">
            <TextPrimary text={s.value} className="text-2xl font-black text-primary" />
            {s.badge === "trending_up" ? (
              <TextPrimary text="trending_up" className={`material-symbols-outlined text-sm mb-1 ${s.badgeColor}`} />
            ) : (
              <TextPrimary text={s.badge} className={`text-[0.625rem] font-bold mb-1 ${s.badgeColor}`} />
            )}
          </Row>
        </Col>
      ))}
    </Row>
  )
}
