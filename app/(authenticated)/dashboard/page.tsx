import { createClient } from '@/lib/supabase/server'
import { WatchlistView } from '@/components/watchlist-view'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const user = authData?.claims

  const { data: items } = await supabase
    .from('watchlist_items')
    .select('*')
    .eq('user_id', user?.sub)
    .order('added_at', { ascending: false })

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-text mb-1">My FlixList</h1>
      <p className="text-text-muted text-sm mb-8">Signed in as {user?.email}</p>
      <WatchlistView items={items ?? []} />
    </div>
  )
}