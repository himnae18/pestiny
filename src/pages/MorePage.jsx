import { LogIn, LogOut, Settings, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function MorePage({ user }) {
  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
  }

  return (
    <section className="page more-page">
      <div className="account-card">
        <div className="avatar"><UserRound size={34} /></div>
        <div>
          <span>{user ? '로그인 계정' : '게스트 모드'}</span>
          <strong>{user?.email || '로그인하지 않았어요'}</strong>
        </div>
      </div>

      <div className="settings-list">
        <div><Settings /><span><strong>서비스 정보</strong><small>운명 한 장 v1.0.0</small></span></div>
        {!isSupabaseConfigured && <div className="warning-row"><span>Supabase 환경변수를 설정하면 실제 회원가입과 계정별 저장이 활성화됩니다.</span></div>}
        {user ? (
          <button onClick={logout}><LogOut /><span><strong>로그아웃</strong><small>현재 계정에서 나가기</small></span></button>
        ) : (
          <Link to="/auth"><LogIn /><span><strong>로그인 / 회원가입</strong><small>기록을 계정에 안전하게 저장하기</small></span></Link>
        )}
      </div>

      <p className="legal-note">운세 결과는 재미를 위한 콘텐츠이며 중요한 결정의 근거로 사용하지 마세요.</p>
    </section>
  )
}
