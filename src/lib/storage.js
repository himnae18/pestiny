const KEY = 'fortune-draw-guest-records'

export function loadGuestRecords() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveGuestRecord(record) {
  const records = loadGuestRecords()
  const index = records.findIndex((item) => item.date === record.date)
  if (index >= 0) records[index] = { ...records[index], ...record }
  else records.push(record)
  localStorage.setItem(KEY, JSON.stringify(records))
  return records
}
