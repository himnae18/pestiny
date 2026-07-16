import { HeartHandshake, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <section className="page home-page">
      <div className="hero-card">
        <span className="hero-moon">☾</span>
        <p>오늘 당신에게 도착한</p>
        <h2>단 한 장의 운명</h2>
        <span>가볍게 뽑고, 마음에 남으면 기록해 보세요.</span>
      </div>

      <div className="draw-menu">
        <Link to="/fortune" className="draw-button fortune-button">
          <div className="icon-orbit"><Sparkles size={34} /></div>
          <div>
            <strong>오늘의 운세</strong>
            <span>행운 등급과 메시지 뽑기</span>
          </div>
          <b>→</b>
        </Link>

        <Link to="/compatibility" className="draw-button compatibility-button">
          <div className="icon-orbit"><HeartHandshake size={34} /></div>
          <div>
            <strong>우리의 궁합</strong>
            <span>이름을 넣고 관계의 운 뽑기</span>
          </div>
          <b>→</b>
        </Link>
      </div>

      <div className="notice-card">
        <strong>기록 팁</strong>
        <p>뽑은 결과를 달력에 저장하면 날짜별 메모를 함께 남길 수 있어요. 로그인하면 기기를 바꿔도 기록이 유지됩니다.</p>
      </div>
    </section>
  )
}
