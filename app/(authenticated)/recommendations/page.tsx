import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { generateTasteProfile } from '@/lib/gemini'
import { getPopularMovies, findMovieByTitleAndYear, type TmdbMovie } from '@/lib/tmdb'
import { AddToWatchlistButton } from '@/components/add-to-watchlist-button'
import { TrailerButton } from '@/components/trailer-button'
import { WatchProviders } from '@/components/watch-providers'

export default async function RecommendationsPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  const { data: watched } = await supabase
    .from('watchlist_items')
    .select('title, genres, rating')
    .eq('user_id', userId)
    .eq('status', 'watched')

  const hasHistory = (watched?.length ?? 0) > 0

  if (!hasHistory) {
    const popular = await getPopularMovies()
    return (
      <div className="min-h-screen bg-bg px-4 py-8 max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-text mb-2">Recommendations</h1>
        <p className="text-text-muted mb-8">
          Watch and rate a few movies to get a personalized taste profile. In the meantime, here's what's popular right now.
        </p>
        <PosterGrid movies={popular.slice(0, 10)} />
      </div>
    )
  }

  let tasteProfile: string
  let recommendedMovies: (TmdbMovie & { reason: string })[] = []

  try {
    const result = await generateTasteProfile(watched!)
    tasteProfile = result.tasteProfile

    const matched = await Promise.all(
      result.recommendations.map(async (rec) => {
        const movie = await findMovieByTitleAndYear(rec.title, rec.year)
        return movie ? { ...movie, reason: rec.reason } : null
      })
    )
    recommendedMovies = matched.filter((m): m is TmdbMovie & { reason: string } => m !== null)
  } catch (error) {
    console.error('AI recommendation error:', error)
    return (
      <div className="min-h-screen bg-bg px-4 py-8 max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-text mb-4">Recommendations</h1>
        <p className="text-accent-red">Couldn't generate recommendations right now. Try again later.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-text mb-4">Recommendations</h1>

      <div className="bg-surface p-6 mb-10">
        <p className="text-text">{tasteProfile}</p>
      </div>

      <h2 className="font-display text-2xl font-bold text-text mb-4">You might like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recommendedMovies.map((movie) => (
          <div key={movie.id} className="flex flex-col gap-2">
            <div className="relative aspect-[2/3] bg-surface">
              {movie.poster_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-text text-sm font-medium line-clamp-1">{movie.title}</p>
            <p className="text-text-muted text-xs line-clamp-2">{movie.reason}</p>
            <div className="flex gap-2">
              <AddToWatchlistButton movie={movie} />
              <TrailerButton movieId={movie.id} />
            </div>
            <WatchProviders movieId={movie.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PosterGrid({ movies }: { movies: TmdbMovie[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="flex flex-col gap-2">
          <div className="relative aspect-[2/3] bg-surface">
            {movie.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover"
              />
            )}
          </div>
          <p className="text-text text-sm font-medium line-clamp-1">{movie.title}</p>
          <AddToWatchlistButton movie={movie} />
        </div>
      ))}
    </div>
  )
}