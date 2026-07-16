import { isSupabaseConfigured, supabase } from './supabase'
import { loadGuestRecords, saveGuestRecord } from './storage'

export async function fetchRecords(user) {
  if (!user || !isSupabaseConfigured) return loadGuestRecords()
  const { data, error } = await supabase
    .from('fortune_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('fortune_date', { ascending: true })
  if (error) throw error
  return data.map((row) => ({
    id: row.id,
    date: row.fortune_date,
    result: row.result_json,
    note: row.note || '',
  }))
}

export async function upsertRecord(user, record) {
  if (!user || !isSupabaseConfigured) return saveGuestRecord(record)
  const { data, error } = await supabase
    .from('fortune_logs')
    .upsert({
      user_id: user.id,
      fortune_date: record.date,
      result_json: record.result,
      note: record.note || '',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,fortune_date' })
    .select()
    .single()
  if (error) throw error
  return data
}
