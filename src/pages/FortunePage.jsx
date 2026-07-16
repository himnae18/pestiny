import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import ResultCard from '../components/ResultCard'
import { drawFortune } from '../data/fortune'
import { toDateKey } from '../lib/date'
import { upsertRecord } from '../lib/records'

export default function FortunePage({ user }) {
  const [result, setResult] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  const draw = () => {
    setDrawing(true)
    setSaved(false)
    setMessage('')
    setTimeout(() => {
      setResult(drawFortune())
      setDrawing(false)
    }, 850)
  }

  const save = async () => {
    try {
      await upsertRecord(user, { date: toDateKey(new Date()), result, note: '' })
      setSaved(true)
      setMessage(user ? '계정 달력에 저장했어요.' : '게스트 기록으로 이 기기에 저장했어요.')
    } catch (error) {
      setMessage(error.message || '저장하지 못했어요.')
    }
  }

  return (
    <section className="page draw-page">
      <div className="page-title">
        <span>오늘의 운세</span>
        <h2>카드를 뒤집어 운을 확인하세요</h2>
      </div>

      {!result && (
        <button className={`mystery-card ${drawing ? 'drawing' : ''}`} onClick={draw} disabled={drawing}>
          <Sparkles size={42} />
          <strong>{drawing ? '운명을 섞는 중…' : '운세 한 장 뽑기'}</strong>
          <span>오늘은 어떤 흐름이 기다리고 있을까요?</span>
        </button>
      )}

      {result && <ResultCard result={result} onSave={save} saved={saved} />}
      {message && <p className="status-message">{message}</p>}
      {result && <button className="primary-button full" onClick={draw}>한 번 더 뽑기</button>}
    </section>
  )
}
