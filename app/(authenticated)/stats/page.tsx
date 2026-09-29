import { createClient } from '@/lib/supabase/server'
import { GenrePieChart } from '@/components/genre-pie-chart'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  const { data: watched } = await supabase
    .from('watchlist_items')
    .select('rating, genres')
    .eq('user_id', userId)
    .eq('status', 'watched')

  const items = watched ?? []
  const totalWatched = items.length

  const ratedItems = items.filter((i) => i.rating != null)
  const averageRating =
    ratedItems.length > 0
      ? ratedItems.reduce((sum, i) => sum + (i.rating ?? 0), 0) / ratedItems.length
      : null

  // Count per genre across all watched movies
  const genreCounts: Record<string, number> = {}
  for (const item of items) {
    for (const genre of item.genres ?? []) {
      genreCounts[genre] = (genreCounts[genre] ?? 0) + 1
    }
  }

  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
  const maxGenreCount = sortedGenres[0]?.[1] ?? 1

  return (
    <div className="min-h-screen bg-bg px-4 py-8 max-w-3xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-text mb-8">Your Stats</h1>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface p-6">
          <p className="text-text-muted text-sm mb-1">Movies watched</p>
          <p className="font-display text-5xl font-bold text-accent">{totalWatched}</p>
        </div>
        <div className="bg-surface p-6">
          <p className="text-text-muted text-sm mb-1">Average rating</p>
          <p className="font-display text-5xl font-bold text-accent">
            {averageRating !== null ? averageRating.toFixed(1) : '\u2014'}
          </p>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold text-text mb-4">Genre breakdown</h2>

      {sortedGenres.length === 0 ? (
        <p className="text-text-muted">Watch and rate some movies to see your genre breakdown.</p>
      ) : (
        <GenrePieChart data={sortedGenres.map(([name, value]) => ({ name, value }))} />
      )}
    </div>
  )
}