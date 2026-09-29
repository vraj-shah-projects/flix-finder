'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { StarRating } from '@/components/star-rating'
import { markAsWatched, markAsUnwatched, removeFromWatchlist } from '@/app/watchlist/actions'

type WatchlistItem = {
  id: string
  title: string
  poster_path: string | null
  genres: string[]
  status: string
  rating: number | null
  added_at: string
  watched_at: string | null
}

async function markAsWatchedForm(itemId: string) {
  await markAsWatched(itemId)
}

async function markAsUnwatchedForm(itemId: string) {
  await markAsUnwatched(itemId)
}

async function removeFromWatchlistForm(itemId: string) {
  await removeFromWatchlist(itemId)
}

type SortOption = 'added_desc' | 'added_asc' | 'rating_desc' | 'rating_asc' | 'title_asc'

export function WatchlistView({ items }: { items: WatchlistItem[] }) {
  const [sort, setSort] = useState<SortOption>('added_desc')
  const [genreFilter, setGenreFilter] = useState<string>('all')

  const allGenres = useMemo(() => {
    const set = new Set<string>()
    items.forEach((item) => item.genres?.forEach((g) => set.add(g)))
    return Array.from(set).sort()
  }, [items])

  const filteredAndSorted = useMemo(() => {
    let result = items

    if (genreFilter !== 'all') {
      result = result.filter((item) => item.genres?.includes(genreFilter))
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'added_asc':
          return new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
        case 'rating_desc':
          return (b.rating ?? -1) - (a.rating ?? -1)
        case 'rating_asc':
          return (a.rating ?? 11) - (b.rating ?? 11)
        case 'title_asc':
          return a.title.localeCompare(b.title)
        case 'added_desc':
        default:
          return new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      }
    })

    return result
  }, [items, sort, genreFilter])

  const watching = filteredAndSorted.filter((i) => i.status === 'watchlist')
  const watched = filteredAndSorted.filter((i) => i.status === 'watched')

  return (
    <div>
      <div className="flex gap-4 mb-8 flex-wrap">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-surface text-text text-sm px-3 py-2 rounded-md border border-text-muted/20"
        >
          <option value="added_desc">Recently added</option>
          <option value="added_asc">Oldest added</option>
          <option value="rating_desc">Highest rated</option>
          <option value="rating_asc">Lowest rated</option>
          <option value="title_asc">Title (A-Z)</option>
        </select>

        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="bg-surface text-text text-sm px-3 py-2 rounded-md border border-text-muted/20"
        >
          <option value="all">All genres</option>
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-text mb-4">
          Watching ({watching.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watching.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="relative aspect-[2/3] bg-surface">
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-text text-sm font-medium line-clamp-1">{item.title}</p>
              <form action={markAsWatchedForm.bind(null, item.id)}>
                <button className="text-xs text-accent">Mark as watched</button>
              </form>
              <form action={removeFromWatchlistForm.bind(null, item.id)}>
                <button className="text-xs text-accent-red">Remove</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-text mb-4">
          Watched ({watched.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watched.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="relative aspect-[2/3] bg-surface">
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-text text-sm font-medium line-clamp-1">{item.title}</p>
              <StarRating itemId={item.id} initialRating={item.rating} />
              <form action={markAsUnwatchedForm.bind(null, item.id)}>
                <button className="text-xs text-text-muted hover:text-accent">Mark as unwatched</button>
                </form>
              <form action={removeFromWatchlistForm.bind(null, item.id)}>
                <button className="text-xs text-accent-red">Remove</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}