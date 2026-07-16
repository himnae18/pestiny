import { useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import ResultCard from '../components/ResultCard'
import { drawCompatibility } from '../data/fortune'
import { toDateKey } from '../lib/date'
import { upsertRecord } from '../lib/records'

export default function CompatibilityPage({ user }) {
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [relation, setRelation] = useState('연인')
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')

  const draw = (event) => {
    event.preventDefault()
    if (!nameA.trim() || !nameB.trim()) {
      setMessage('두 사람의 이름을 모두 입력해 주세요.')
      return
    }
    setMessage('')
    setSaved(false)
    setResult(drawCompatibility(nameA, nameB, relation))
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
        <span>우리의 궁합</span>
        <h2>두 사람의 관계 운을 뽑아 보세요</h2>
      </div>

      <form className="compat-form" onSubmit={draw}>
        <div className="two-inputs">
          <label>나의 이름<input value={nameA} onChange={(e) => setNameA(e.target.value)} placeholder="예: 힘내" maxLength={12} /></label>
          <label>상대 이름<input value={nameB} onChange={(e) => setNameB(e.target.value)} placeholder="예: 소유" maxLength={12} /></label>
        </div>
        <label>관계
          <select value={relation} onChange={(e) => setRelation(e.target.value)}>
            <option>연인</option><option>친구</option><option>썸</option><option>동료</option><option>가족</option>
          </select>
        </label>
        <button className="primary-button full" type="submit"><HeartHandshake size={20} /> 궁합 뽑기</button>
      </form>

      {result && <ResultCard result={result} onSave={save} saved={saved} />}
      {message && <p className="status-message">{message}</p>}
    </section>
  )
}
