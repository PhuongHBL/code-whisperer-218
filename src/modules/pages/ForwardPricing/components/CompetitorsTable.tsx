import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"

interface CompetitorRow {
  channel: string
  company: string
  companyInitial: string
  initialBg: string
  initialText: string
  category: string
  dates: string
  duration: string
  location: string
  dailyRate: string
  totalRate: string
  isHighPrice?: boolean
}

const rows: CompetitorRow[] = [
  { channel: "Expedia", company: "Hertz Australia", companyInitial: "H", initialBg: "bg-primary-fixed", initialText: "text-primary", category: "COMPACT SUV", dates: "15/11 - 18/11", duration: "3d", location: "SYD Airport", dailyRate: "$89.00", totalRate: "$267.00" },
  { channel: "Direct", company: "Avis Fleet", companyInitial: "A", initialBg: "bg-surface-container-high", initialText: "text-on-surface", category: "LUXURY SEDAN", dates: "15/11 - 18/11", duration: "3d", location: "SYD Airport", dailyRate: "$142.00", totalRate: "$426.00", isHighPrice: true },
  { channel: "Booking.com", company: "Sixt AU", companyInitial: "S", initialBg: "bg-destructive/10", initialText: "text-destructive", category: "COMPACT SUV", dates: "15/11 - 18/11", duration: "3d", location: "SYD Airport", dailyRate: "$92.50", totalRate: "$277.50" },
  { channel: "Direct", company: "Europcar", companyInitial: "E", initialBg: "bg-primary-fixed", initialText: "text-primary", category: "ECONOMY HATCH", dates: "15/11 - 18/11", duration: "3d", location: "SYD Airport", dailyRate: "$64.00", totalRate: "$192.00" },
]

export default function CompetitorsTable() {
  return (
    <Box className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/20 overflow-hidden">
      <Box className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-[0.625rem] font-black uppercase tracking-widest text-on-surface-variant">
              <th className="px-6 py-3 border-r border-outline-variant/10">Channel</th>
              <th className="px-6 py-3 border-r border-outline-variant/10">Company</th>
              <th className="px-6 py-3 border-r border-outline-variant/10">Category</th>
              <th className="px-6 py-3 border-r border-outline-variant/10">Dates</th>
              <th className="px-6 py-3 border-r border-outline-variant/10">Dur.</th>
              <th className="px-6 py-3 border-r border-outline-variant/10">Location</th>
              <th className="px-6 py-3 text-right border-r border-outline-variant/10">Daily Rate</th>
              <th className="px-6 py-3 text-right">Total Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low">
            {rows.map((r) => (
              <tr key={r.company} className="hover:bg-primary-fixed/30 transition-colors">
                <td className="px-6 py-4 text-xs font-medium">{r.channel}</td>
                <td className="px-6 py-4">
                  <Row className="items-center gap-2">
                    <Row className={`w-6 h-6 rounded-full ${r.initialBg} items-center justify-center text-[0.625rem] font-bold ${r.initialText}`}>
                      {r.companyInitial}
                    </Row>
                    <TextPrimary text={r.company} className="text-xs font-bold" />
                  </Row>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-secondary-container text-secondary-container-foreground rounded text-[0.625rem] font-bold">{r.category}</span>
                </td>
                <td className="px-6 py-4 text-xs tabular-nums text-on-surface-variant">{r.dates}</td>
                <td className="px-6 py-4 text-xs font-medium">{r.duration}</td>
                <td className="px-6 py-4 text-xs">{r.location}</td>
                <td className={`px-6 py-4 text-right text-xs font-black tabular-nums ${r.isHighPrice ? "text-destructive" : ""}`}>{r.dailyRate}</td>
                <td className={`px-6 py-4 text-right text-xs font-black tabular-nums ${r.isHighPrice ? "text-destructive" : ""}`}>{r.totalRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Row className="px-6 py-4 border-t border-outline-variant/10 justify-between items-center bg-surface-container-low/50">
        <TextPrimary text="Displaying 1 - 4 of 24 competitive records" className="text-xs text-on-surface-variant font-medium" />
        <Row className="gap-1">
          <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
            <TextPrimary text="chevron_left" className="material-symbols-outlined text-sm" />
          </button>
          <button className="px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded shadow-sm">1</button>
          <button className="px-3.5 py-1.5 hover:bg-surface-container-high text-xs font-bold rounded">2</button>
          <button className="px-3.5 py-1.5 hover:bg-surface-container-high text-xs font-bold rounded">3</button>
          <button className="p-2 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant">
            <TextPrimary text="chevron_right" className="material-symbols-outlined text-sm" />
          </button>
        </Row>
      </Row>
    </Box>
  )
}
