export function confidenceBadgeClass(label: string | undefined): string {
  const base =
    "inline-block px-1.5 py-0.5 rounded text-[0.5625rem] font-bold capitalize whitespace-nowrap border"
  const l = (label ?? "").toLowerCase().trim()
  if (l === "high")
    return `${base} bg-green-600/15 text-green-800 dark:text-green-300 border-green-600/25`
  if (l === "medium")
    return `${base} bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/25`
  if (l === "low")
    return `${base} bg-destructive/15 text-destructive border-destructive/25`
  return `${base} bg-secondary-container text-secondary-container-foreground border-transparent`
}

/** Text color classes aligned with `confidenceBadgeClass` label styling. */
export function confidenceLabelTextClass(label: string | undefined): string {
  const l = (label ?? "").toLowerCase().trim()
  if (l === "high") return "text-green-800 dark:text-green-300"
  if (l === "medium") return "text-amber-800 dark:text-amber-200"
  if (l === "low") return "text-destructive"
  return "text-secondary-container-foreground"
}

/** Lightbulb trigger: same hues as the confidence badge, with a light hover wash. */
export function confidenceLabelInsightButtonClass(label: string | undefined): string {
  const base =
    "inline-flex size-6 shrink-0 items-center justify-center rounded-md disabled:pointer-events-none disabled:opacity-35"
  const l = (label ?? "").toLowerCase().trim()
  if (l === "high")
    return `${base} text-green-800 hover:bg-green-600/15 dark:text-green-300 dark:hover:bg-green-600/20`
  if (l === "medium")
    return `${base} text-amber-800 hover:bg-amber-500/15 dark:text-amber-200 dark:hover:bg-amber-500/20`
  if (l === "low")
    return `${base} text-destructive hover:bg-destructive/15`
  return `${base} text-secondary-container-foreground hover:bg-surface-container-high`
}
