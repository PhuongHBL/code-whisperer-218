import { format, isValid, parseISO } from "date-fns";

/**
 * Normalize dashboard / JSON date values to a `yyyy-MM-dd` string.
 * Handles ISO strings, datetimes, unix timestamps (seconds or ms), and plain dates.
 */
export function coerceToYyyyMmDd(
  raw: string | number | null | undefined,
): string | null {
  if (raw == null) return null;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    const ms = Math.abs(raw) < 1e11 ? raw * 1000 : raw;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return format(d, "yyyy-MM-dd");
  }
  const s = String(raw).trim();
  if (!s) return null;
  const ymd = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (ymd) return ymd[1]!;
  const dmY = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmY) {
    const dd = dmY[1]!.padStart(2, "0");
    const mm = dmY[2]!.padStart(2, "0");
    const yyyy = dmY[3]!;
    const d = parseISO(`${yyyy}-${mm}-${dd}`);
    if (isValid(d)) return format(d, "yyyy-MM-dd");
  }
  const d = parseISO(s);
  if (isValid(d)) return format(d, "yyyy-MM-dd");
  const ms = Date.parse(s);
  return Number.isNaN(ms) ? null : format(new Date(ms), "yyyy-MM-dd");
}
