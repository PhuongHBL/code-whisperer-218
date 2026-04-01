import { useEffect, useState } from "react"
import Col from "@/modules/common/components/Col"
import Row from "@/modules/common/components/Row"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import { useQueryFleetOptions } from "@/api/useQueryFleetOptions"

interface SelectFilterProps {
  label: string
  icon?: string
  options?: string[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  inputValue?: string
  isInput?: boolean
}

function SelectFilter({
  label,
  icon = "expand_more",
  options = [],
  value,
  onChange,
  disabled,
  inputValue,
  isInput,
}: SelectFilterProps) {
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
          <select
            className="w-full bg-surface-container-low border-none rounded-md px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-surface-tint/20 appearance-none outline-none disabled:opacity-50"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            aria-label={label}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
        <TextPrimary text={icon} className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant pointer-events-none" />
      </Box>
    </Col>
  )
}

export default function SearchFilters() {
  const { data, isLoading, isError, error } = useQueryFleetOptions()
  const locations = data?.location ?? []
  const categories = data?.car_category ?? []

  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (!data) return
    setPickupLocation((p) => (p === "" && data.location[0] ? data.location[0] : p))
    setDropoffLocation((d) => (d === "" && data.location[0] ? data.location[0] : d))
    setCategory((c) => (c === "" && data.car_category[0] ? data.car_category[0] : c))
  }, [data])

  const locationOpts =
    locations.length > 0 ? locations : isLoading ? ["Loading…"] : isError ? ["—"] : ["No locations"]
  const categoryOpts =
    categories.length > 0 ? categories : isLoading ? ["Loading…"] : isError ? ["—"] : ["No categories"]

  const pickupValue =
    pickupLocation && locationOpts.includes(pickupLocation) ? pickupLocation : (locationOpts[0] ?? "")
  const dropoffValue =
    dropoffLocation && locationOpts.includes(dropoffLocation) ? dropoffLocation : (locationOpts[0] ?? "")
  const categoryValue =
    category && categoryOpts.includes(category) ? category : (categoryOpts[0] ?? "")

  const locationDisabled = isLoading && locations.length === 0
  const categorySelectDisabled = isLoading && categories.length === 0

  return (
    <Box className="bg-surface-container-lowest p-4 md:p-6 rounded-lg shadow-sm">
      {isError ? (
        <TextPrimary
          text={error instanceof Error ? error.message : "Could not load filter options"}
          className="text-sm text-destructive mb-4"
        />
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SelectFilter label="Market" options={["Australia Fleet", "New Zealand Fleet"]} />
        <SelectFilter label="Source Market" options={["All Channels", "Direct Website", "OTA Platform"]} />
        <SelectFilter label="Category Type" options={["Passenger Vehicles", "Commercial Fleet"]} />
        <SelectFilter
          label="Pickup Location"
          icon="location_on"
          options={locationOpts}
          value={pickupValue}
          onChange={setPickupLocation}
          disabled={locationDisabled}
        />
        <SelectFilter
          label="Dropoff Location"
          icon="location_on"
          options={locationOpts}
          value={dropoffValue}
          onChange={setDropoffLocation}
          disabled={locationDisabled}
        />
        <SelectFilter
          label="Category"
          icon="directions_car"
          options={categoryOpts}
          value={categoryValue}
          onChange={setCategory}
          disabled={categorySelectDisabled}
        />
        <SelectFilter label="Duration" icon="schedule" options={["3 - 5 Days", "7 Days", "14+ Days"]} />
        <SelectFilter label="Pickup Date" isInput inputValue="2024-11-15" />
      </div>
    </Box>
  )
}
