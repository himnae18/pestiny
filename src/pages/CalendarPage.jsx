import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { fetchRecords, upsertRecord } from '../lib/records'
import { formatKoreanDate, getMonthGrid, toDateKey } from '../lib/date'

export default function CalendarPage({ user }) {
  const today = new Date()
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [records, setRecords] = useState([])
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')

  const grid = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])
  const selectedRecord = records.find((item) => item.date === selectedDate)

  useEffect(() => {
    fetchRecords(user).then(setRecords).catch((error) => setStatus(error.message))
  }, [user])

  useEffect(() => setNote(selectedRecord?.note || ''), [selectedDate, selectedRecord?.note])

  const moveMonth = (amount) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + amount, 1))

  const saveNote = async () => {
    if (!selectedRecord?.result && !note.trim()) {
      setStatus('저장할 운세나 메모가 없어요.')
      return
    }
    try {
      await upsertRecord(user, { date: selectedDate, result: selectedRecord?.result || null, note })
      const next = await fetchRecords(user)
      setRecords(next)
      setStatus(user ? '계정에 메모를 저장했어요.' : '이 기기에 메모를 저장했어요.')
    } catch (error) {
      setStatus(error.message || '저장하지 못했어요.')
    }
  }

  return (
    <section className="page calendar-page">
      <div className="calendar-head">
        <button onClick={() => moveMonth(-1)} aria-label="이전 달"><ChevronLeft /></button>
        <h2>{cursor.getFullYear()}년 {cursor.getMonth() + 1}월</h2>
        <button onClick={() => moveMonth(1)} aria-label="다음 달"><ChevronRight /></button>
      </div>

      <div className="calendar-card">
        <div className="week-row">{['일','월','화','수','목','금','토'].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="date-grid">
          {grid.map((date, index) => {
            if (!date) return <span className="blank" key={`blank-${index}`} />
            const key = toDateKey(date)
            const hasRecord = records.some((record) => record.date === key)
            return (
              <button key={key} onClick={() => setSelectedDate(key)} className={`${key === selectedDate ? 'selected' : ''} ${key === toDateKey(today) ? 'today' : ''}`}>
                {date.getDate()}
                {hasRecord && <i />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="day-record">
        <p className="selected-date">{formatKoreanDate(selectedDate)}</p>
        {selectedRecord?.result ? (
          <div className="mini-result">
            <span>{selectedRecord.result.grade}</span>
            <strong>{selectedRecord.result.title}</strong>
            <p>{selectedRecord.result.body}</p>
          </div>
        ) : <div className="empty-record">이 날짜에 저장된 운세가 없어요.</div>}

        <label className="memo-label">하루 메모
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="그날 있었던 일이나 운세가 맞았는지 적어 보세요." maxLength={1000} />
        </label>
        <button className="primary-button full" onClick={saveNote}><Save size={18} /> 메모 저장</button>
        {status && <p className="status-message">{status}</p>}
      </div>
    </section>
  )
}
