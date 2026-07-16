import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import CalendarPage from './pages/CalendarPage'
import CompatibilityPage from './pages/CompatibilityPage'
import FortunePage from './pages/FortunePage'
import HomePage from './pages/HomePage'
import MorePage from './pages/MorePage'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getUser().then(({ data }) => setUser(data.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/fortune" element={<FortunePage user={user} />} />
        <Route path="/compatibility" element={<CompatibilityPage user={user} />} />
        <Route path="/calendar" element={<CalendarPage user={user} />} />
        <Route path="/more" element={<MorePage user={user} />} />
        <Route path="/auth" element={<AuthPage user={user} />} />
      </Route>
    </Routes>
  )
}
