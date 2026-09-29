import { createClient } from '@/lib/supabase/server'
import { generateWrappedBlurb } from '@/lib/gemini'
import { WrappedCard } from '@/components/wrapped-card'

export default async function WrappedPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  const { data: watched } = await supabase
    .from('watchlist_items')
    .select('title, genres, rating, poster_path')
    .eq('user_id', userId)
    .eq('status', 'watched')

  const items = watched ?? []

  if (items.length === 0) {
    return (
      <div>
        <h1 className="font-display text-4xl font-bold text-text mb-4">Your Wrapped</h1>
        <p className="text-text-muted">Watch and rate a few movies to unlock your recap.</p>
      </div>
    )
  }

  const genreCounts: Record<string, number> = {}
  for (const item of items) {
    for (const genre of item.genres ?? []) {
      genreCounts[genre] = (genreCounts[genre] ?? 0) + 1
    }
  }
  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown'

  const rated = items.filter((i) => i.rating != null)
  const averageRating =
    rated.length > 0 ? rated.reduce((sum, i) => sum + (i.rating ?? 0), 0) / rated.length : null

  const highestRated = rated.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0] ?? null

  let blurb = 'A year of movies, well spent.'
  try {
    const result = await generateWrappedBlurb(items)
    blurb = result.blurb
  } catch (error) {
    console.error('Wrapped blurb error:', error)
  }

  return (
    <WrappedCard
      totalWatched={items.length}
      topGenre={topGenre}
      averageRating={averageRating}
      highestRated={highestRated}
      blurb={blurb}
    />
  )
}