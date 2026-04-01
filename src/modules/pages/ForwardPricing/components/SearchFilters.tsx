import { useEffect, useMemo, useState } from "react"
import { format, isValid, parse } from "date-fns"
import Col from "@/modules/common/components/Col"
import Box from "@/modules/common/components/Box"
import TextPrimary from "@/modules/common/components/TextPrimary"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useQueryFleetOptions } from "@/api/useQueryFleetOptions"

export interface ForwardPricingFilterValues {
  location: string
  carCategory: string
  pickupDate: string
  rentalDuration: string
}

interface SelectFilterProps {
  label: string
  icon?: string
  options?: string[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  isInput?: boolean
  inputType?: "text" | "number"
}

function SelectFilter({
  label,
  icon = "expand_more",
  options = [],
  value,
  onChange,
  disabled,
  isInput,
  inputType = "text",
}: SelectFilterProps) {
  return (
    <Col className="gap-1">
      <TextPrimary text={label} className="text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant" />
      <Box className="relative">
        {isInput ? (
          <input
            type={inputType}
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="w-full bg-surface-container-low border-none rounded-md px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-surface-tint/20 outline-none disabled:opacity-50"
            aria-label={label}
          />
        ) : (
          <select
            className="w-full bg-surface-container-low border-none rounded-md px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-surface-tint/20 appearance-none outline-none disabled:opacity-50"
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
        {isInput ? (
          <TextPrimary text={icon} className="material-symbols-outlined absolute right-2.5 top-2 text-sm text-on-surface-variant pointer-events-none" />
        ) : null}
      </Box>
    </Col>
  )
}

function rangeInclusive(min: number, max: number): string[] {
  const out: string[] = []
  for (let d = min; d <= max; d += 1) out.push(String(d))
  return out
}

const YMD = "yyyy-MM-dd" as const
const DMY = "dd/MM/yyyy" as const

function ymdToDdMmYyyy(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ""
  const d = parse(ymd, YMD, new Date())
  return isValid(d) ? format(d, DMY) : ""
}

function PickupDatePickerField({
  ymdValue,
  minYmd,
  onCommitYmd,
}: {
  ymdValue: string
  minYmd: string
  onCommitYmd: (ymd: string) => void
}) {
  const effectiveYmd = ymdValue < minYmd ? minYmd : ymdValue
  const selected = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveYmd)) return undefined
    const d = parse(effectiveYmd, YMD, new Date())
    return isValid(d) ? d : undefined
  }, [effectiveYmd])

  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState<Date>(() => selected ?? parse(minYmd, YMD, new Date()))

  useEffect(() => {
    if (selected) setMonth(selected)
  }, [selected])

  const display = ymdToDdMmYyyy(effectiveYmd) || "Select date"

  return (
    <Col className="gap-1">
      <TextPrimary
        text="Pickup date"
        className="text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant"
      />
      <Box className="relative w-full">
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (next && selected) setMonth(selected)
          }}
        >
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full bg-surface-container-low border-none rounded-md pl-3 pr-9 py-2",
                "text-left text-xs font-medium text-on-surface appearance-none",
                "focus:outline-none focus:ring-2 focus:ring-surface-tint/20",
                "flex items-center min-w-0 min-h-0",
              )}
              aria-label="Pickup date, open calendar"
              aria-expanded={open}
            >
              <span className="block w-full truncate tabular-nums">{display}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={(d) => {
                if (!d) return
                const ymd = format(d, YMD)
                if (ymd >= minYmd) {
                  onCommitYmd(ymd)
                  setOpen(false)
                }
              }}
              disabled={(date) => format(date, YMD) < minYmd}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <TextPrimary
          text="calendar_month"
          className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant pointer-events-none"
        />
      </Box>
    </Col>
  )
}

interface SearchFiltersProps {
  values: ForwardPricingFilterValues
  onValuesChange: (patch: Partial<ForwardPricingFilterValues>) => void
}

export default function SearchFilters({ values, onValuesChange }: SearchFiltersProps) {
  const { data, isLoading, isError, error } = useQueryFleetOptions()
  const locations = data?.location ?? []
  const categories = data?.car_category ?? []
  const rd = data?.rental_duration

  const rentalDurationOptions = useMemo(() => {
    if (rd && rd.min <= rd.max) return rangeInclusive(rd.min, rd.max)
    return rangeInclusive(1, 30)
  }, [rd])

  const locationOpts =
    locations.length > 0 ? locations : isLoading ? ["Loading…"] : isError ? ["—"] : ["No locations"]
  const categoryOpts =
    categories.length > 0 ? categories : isLoading ? ["Loading…"] : isError ? ["—"] : ["No categories"]

  const locationValue =
    values.location && locationOpts.includes(values.location)
      ? values.location
      : (locationOpts[0] ?? "")
  const categoryValue =
    values.carCategory && categoryOpts.includes(values.carCategory)
      ? values.carCategory
      : (categoryOpts[0] ?? "")
  const rentalDurationValue =
    values.rentalDuration && rentalDurationOptions.includes(values.rentalDuration)
      ? values.rentalDuration
      : (rentalDurationOptions[0] ?? "3")

  const locationDisabled = isLoading && locations.length === 0
  const categoryDisabled = isLoading && categories.length === 0
  const rentalDisabled = isLoading && !rd

  const pickupDateMin = format(new Date(), "yyyy-MM-dd")

  useEffect(() => {
    if (!values.pickupDate || values.pickupDate >= pickupDateMin) return
    onValuesChange({ pickupDate: pickupDateMin })
  }, [values.pickupDate, pickupDateMin, onValuesChange])

  return (
    <Box className="bg-surface-container-lowest p-3 md:p-5 rounded-lg shadow-sm">
      {isError ? (
        <TextPrimary
          text={error instanceof Error ? error.message : "Could not load filter options"}
          className="text-xs text-destructive mb-3"
        />
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SelectFilter
          label="Location"
          icon="location_on"
          options={locationOpts}
          value={locationValue}
          onChange={(location) => onValuesChange({ location })}
          disabled={locationDisabled}
        />
        <SelectFilter
          label="Car category"
          icon="directions_car"
          options={categoryOpts}
          value={categoryValue}
          onChange={(carCategory) => onValuesChange({ carCategory })}
          disabled={categoryDisabled}
        />
        <PickupDatePickerField
          ymdValue={values.pickupDate}
          minYmd={pickupDateMin}
          onCommitYmd={(pickupDate) => onValuesChange({ pickupDate })}
        />
        <SelectFilter
          label="Rental duration (days)"
          icon="schedule"
          options={rentalDurationOptions}
          value={rentalDurationValue}
          onChange={(rentalDuration) => onValuesChange({ rentalDuration })}
          disabled={rentalDisabled}
        />
      </div>
    </Box>
  )
}
