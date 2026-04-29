const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  const parts = dateStr.split('-')
  if (parts.length === 1) return parts[0]
  const [year, month] = parts
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`
}

export function formatDateRange(start, end, isCurrent) {
  const startStr = formatDate(start)
  const endStr = isCurrent ? 'Present' : formatDate(end)
  return `${startStr} – ${endStr}`
}

export function formatMoney(value, currency = 'USD') {
  if (value >= 1_000_000) return `$${parseFloat((value / 1_000_000).toFixed(2))}M`
  if (value >= 1_000) return `$${parseFloat((value / 1_000).toFixed(2))}K`
  return `$${value}`
}

const TIME_UNIT_ABBREVS = {
  year: 'yr', years: 'yr',
  month: 'mo', months: 'mo',
  week: 'wk', weeks: 'wk',
  day: 'd', days: 'd',
  hour: 'hr', hours: 'hr',
  minute: 'min', minutes: 'min',
  second: 'sec', seconds: 'sec',
}

// Returns { number, suffix } so callers can style them independently.
// suffix is '' when there is no abbreviation.
export function formatMetricParts(value, unit) {
  const timeAbbrev = TIME_UNIT_ABBREVS[unit?.toLowerCase()]

  if (typeof value !== 'number') {
    return { number: String(value), suffix: timeAbbrev ?? '' }
  }
  if (unit === 'percent') return { number: String(value), suffix: '%' }
  if (unit === 'USD') {
    if (value >= 1_000_000) return { number: `$${parseFloat((value / 1_000_000).toFixed(2))}`, suffix: 'M' }
    if (value >= 1_000)     return { number: `$${parseFloat((value / 1_000).toFixed(2))}`,     suffix: 'K' }
    return { number: `$${value}`, suffix: '' }
  }
  if (timeAbbrev) return { number: String(value), suffix: timeAbbrev }
  if (value >= 1_000_000) return { number: String(parseFloat((value / 1_000_000).toFixed(2))), suffix: 'M' }
  if (value >= 1_000)     return { number: String(parseFloat((value / 1_000).toFixed(2))),     suffix: 'K' }
  return { number: String(value), suffix: '' }
}

export function formatMetricValue(value, unit) {
  const timeAbbrev = TIME_UNIT_ABBREVS[unit?.toLowerCase()]

  if (typeof value !== 'number') {
    return timeAbbrev ? `${value} ${timeAbbrev}` : String(value)
  }
  if (unit === 'percent') return `${value}%`
  if (unit === 'USD') return formatMoney(value)

  const abbrevNum = value >= 1_000_000
    ? `${parseFloat((value / 1_000_000).toFixed(2))}M`
    : value >= 1_000
    ? `${parseFloat((value / 1_000).toFixed(2))}K`
    : String(value)

  return timeAbbrev ? `${abbrevNum} ${timeAbbrev}` : abbrevNum
}
