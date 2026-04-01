/** Empty `selected` means include every competitor from fleet options. */
export function resolveCompetitorsForRequest(selected: string[], allCompetitors: string[]): string[] {
  if (selected.length === 0) return [...allCompetitors]
  return selected.filter((c) => allCompetitors.includes(c))
}
