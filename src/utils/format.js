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
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}
