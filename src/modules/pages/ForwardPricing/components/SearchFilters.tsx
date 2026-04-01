import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"

interface SelectFilterProps {
  label: string
  icon?: string
  options?: string[]
  inputValue?: string
  isInput?: boolean
}

function SelectFilter({ label, icon = "expand_more", options, inputValue, isInput }: SelectFilterProps) {
  return (
    <Col className="gap-1.5">
      <TextPrimary text={label} className="text-[0.625rem] font-black uppercase tracking-widest text-on-surface-variant" />
      <Box className="relative">
        {isInput ? (
          <input
            type={label === "Pickup Date" ? "date" : "text"}
            defaultValue={inputValue}
            className="w-full bg-surface-container-low border-none rounded-md px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-surface-tint/20 outline-none"
          />
        ) : (
          <select className="w-full bg-surface-container-low border-none rounded-md px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-surface-tint/20 appearance-none outline-none">
            {options?.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
        <TextPrimary text={icon} className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none" />
      </Box>
    </Col>
  )
}

export default function SearchFilters() {
  return (
    <Box className="bg-surface-container-lowest p-6 rounded-lg shadow-sm">
      <Row className="flex-col md:flex-row flex-wrap gap-6">
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Market" options={["Australia Fleet", "New Zealand Fleet"]} />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Source Market" options={["All Channels", "Direct Website", "OTA Platform"]} />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Category Type" options={["Passenger Vehicles", "Commercial Fleet"]} />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Pickup Location" icon="location_on" isInput inputValue="Sydney Airport (SYD)" />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Dropoff Location" icon="location_on" isInput inputValue="Sydney Airport (SYD)" />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Category" icon="directions_car" options={["Compact SUV", "Luxury Sedan", "Economy Hatch"]} />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Duration" icon="schedule" options={["3 - 5 Days", "7 Days", "14+ Days"]} />
        </Box>
        <Box className="flex-1 min-w-[180px]">
          <SelectFilter label="Pickup Date" isInput inputValue="2024-11-15" />
        </Box>
      </Row>
    </Box>
  )
}
