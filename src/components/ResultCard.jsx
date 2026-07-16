import { Clock3, Palette, Sparkles } from 'lucide-react'

export default function ResultCard({ result, onSave, saved }) {
  if (!result) return null

  return (
    <article className={`result-card grade-${result.grade}`}>
      <div className="result-glow" />
      <div className="result-head">
        <span className="grade-badge">{result.grade}</span>
        <span className="score">{result.score}점</span>
      </div>
      <h2>{result.title}</h2>
      <p className="result-body">{result.body}</p>

      {result.type === 'fortune' ? (
        <div className="lucky-grid">
          <div><Palette size={18} /><span>행운색</span><strong>{result.luckyColor}</strong></div>
          <div><Sparkles size={18} /><span>행운템</span><strong>{result.luckyItem}</strong></div>
          <div><Clock3 size={18} /><span>행운시간</span><strong>{result.luckyTime}</strong></div>
        </div>
      ) : (
        <div className="keyword-row">
          {result.keywords.map((keyword) => <span key={keyword}>#{keyword}</span>)}
        </div>
      )}

      <button className="secondary-button full" onClick={onSave} disabled={saved}>
        {saved ? '오늘 달력에 저장됨' : '오늘 달력에 저장'}
      </button>
    </article>
  )
}
