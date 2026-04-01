import { useState } from "react"
import Row from "@/modules/common/components/Row"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"

interface DayCard {
  day: string
  date: string
  price: string
  priceColor: string
  dateValue: string
}

const days: DayCard[] = [
  { day: "Wed 13 Nov", date: "13 Nov", price: "$72.00", priceColor: "text-green-600", dateValue: "2024-11-13" },
  { day: "Thu 14 Nov", date: "14 Nov", price: "$68.50", priceColor: "text-green-600", dateValue: "2024-11-14" },
  { day: "Fri 15 Nov", date: "15 Nov", price: "$89.00", priceColor: "", dateValue: "2024-11-15" },
  { day: "Sat 16 Nov", date: "16 Nov", price: "$124.00", priceColor: "text-destructive", dateValue: "2024-11-16" },
  { day: "Sun 17 Nov", date: "17 Nov", price: "$138.00", priceColor: "text-destructive", dateValue: "2024-11-17" },
  { day: "Mon 18 Nov", date: "18 Nov", price: "$84.20", priceColor: "text-green-600", dateValue: "2024-11-18" },
  { day: "Tue 19 Nov", date: "19 Nov", price: "$79.90", priceColor: "text-green-600", dateValue: "2024-11-19" },
]

export default function PriceCalendar() {
  const [selected, setSelected] = useState("2024-11-15")

  return (
    <Box className="bg-surface-container-lowest rounded-lg shadow-sm p-3 md:p-4 ring-1 ring-outline-variant/10">
      <Row className="items-center justify-between gap-2 md:gap-4">
        <button className="p-1.5 md:p-2 hover:bg-surface-container-low rounded-full transition-colors shrink-0">
          <TextPrimary text="chevron_left" className="material-symbols-outlined text-on-surface-variant" />
        </button>
        <Row className="flex-1 gap-2 overflow-x-auto pb-2 sm:pb-0">
          {days.map((d) => {
            const isSelected = selected === d.dateValue
            return (
              <Col
                key={d.dateValue}
                onClick={() => setSelected(d.dateValue)}
                className={`min-w-[90px] md:min-w-[110px] flex-1 p-2 md:p-3 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary shadow-lg ring-2 ring-primary/20"
                    : "border border-outline-variant/20 hover:border-primary/20 bg-surface-container-lowest"
                }`}
              >
                <TextPrimary text={d.day} className={`text-[0.5rem] md:text-[0.625rem] font-bold uppercase tracking-tight ${isSelected ? "text-primary-foreground opacity-70" : "text-on-surface opacity-60"}`} />
                <TextPrimary text={d.date} className={`text-base md:text-lg font-black mt-0.5 ${isSelected ? "text-primary-foreground" : "text-primary"}`} />
                <TextPrimary text={d.price} className={`text-[0.625rem] md:text-xs font-bold mt-1 ${isSelected ? "text-primary-foreground" : d.priceColor}`} />
              </Col>
            )
          })}
        </Row>
        <button className="p-1.5 md:p-2 hover:bg-surface-container-low rounded-full transition-colors shrink-0">
          <TextPrimary text="chevron_right" className="material-symbols-outlined text-on-surface-variant" />
        </button>
      </Row>
      <Box className="mt-3 border-t border-outline-variant/10 pt-2 text-center">
        <TextPrimary text="Note: Clicking a date updates the 'Pickup Date' filter above" className="text-[0.5rem] md:text-[0.5625rem] font-medium text-on-surface-variant/50 uppercase tracking-widest italic" />
      </Box>
    </Box>
  )
}
