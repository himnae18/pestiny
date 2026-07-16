export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatKoreanDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay()
  const days = []

  for (let i = 0; i < startDay; i += 1) days.push(null)
  for (let day = 1; day <= last.getDate(); day += 1) {
    days.push(new Date(year, month, day))
  }
  while (days.length % 7 !== 0) days.push(null)
  return days
}
