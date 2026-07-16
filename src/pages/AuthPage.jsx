import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function AuthPage({ user }) {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  if (user) return <Navigate to="/more" replace />

  const submit = async (event) => {
    event.preventDefault()
    if (!isSupabaseConfigured) {
      setStatus('먼저 .env에 Supabase 주소와 키를 입력해 주세요.')
      return
    }
    setStatus('처리 중…')
    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password })
    const { error } = await action
    if (error) setStatus(error.message)
    else {
      setStatus(mode === 'login' ? '로그인했어요.' : '회원가입이 완료됐어요. 이메일 인증 설정에 따라 인증 메일을 확인해 주세요.')
      if (mode === 'login') navigate('/more')
    }
  }

  return (
    <section className="page auth-page">
      <div className="page-title"><span>ACCOUNT</span><h2>{mode === 'login' ? '다시 만나서 반가워요' : '운세 기록을 시작해요'}</h2></div>
      <form className="auth-form" onSubmit={submit}>
        <label>이메일<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" /></label>
        <label>비밀번호<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="6자 이상" /></label>
        <button className="primary-button full" type="submit">{mode === 'login' ? '로그인' : '회원가입'}</button>
      </form>
      <button className="text-button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setStatus('') }}>
        {mode === 'login' ? '처음인가요? 회원가입' : '이미 계정이 있나요? 로그인'}
      </button>
      {status && <p className="status-message">{status}</p>}
    </section>
  )
}
