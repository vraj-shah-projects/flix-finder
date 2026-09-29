'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { addToWatchlist } from '@/app/watchlist/actions'
import type { TmdbMovie } from '@/lib/tmdb'
import { AddToWatchlistButton } from '@/components/add-to-watchlist-button'
import { TrailerButton } from '@/components/trailer-button'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TmdbMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set())
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [mode, setMode] = useState<'title' | 'mood'>('title')
  const [moodQuery, setMoodQuery] = useState('')
  const [moodSummary, setMoodSummary] = useState<string | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setStatusMessage(null)

    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setStatusMessage('Search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleMoodSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!moodQuery.trim()) return

    setLoading(true)
    setStatusMessage(null)
    setMoodSummary(null)

    try {
      const res = await fetch('/api/mood-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodQuery }),
      })
      const data = await res.json()

      if (data.error) {
        setStatusMessage(data.error)
        setResults([])
      } else {
        setResults(data.movies)
        setMoodSummary(data.summary)
      }
    } catch {
      setStatusMessage('Mood search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(movie: TmdbMovie) {
    const result = await addToWatchlist(movie)

    if (result.error) {
      setStatusMessage(result.error)
    } else {
      setAddedIds((prev) => new Set(prev).add(movie.id))
      setStatusMessage(`Added "${movie.title}" to your watchlist`)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-4 py-8 max-w-5xl mx-auto">
      <h1 className="font-display text-4xl font-bold text-text mb-6">
        Search movies
      </h1>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMode('title')}
          className={`text-sm font-medium ${mode === 'title' ? 'text-accent' : 'text-text-muted'}`}
        >
          Search by title
        </button>
        <button
          onClick={() => setMode('mood')}
          className={`text-sm font-medium ${mode === 'mood' ? 'text-accent' : 'text-text-muted'}`}
        >
          Search by mood
        </button>
      </div>

      {mode === 'title' ? (
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a movie..." />
          <Button type="submit">Search</Button>
        </form>
      ) : (
        <form onSubmit={handleMoodSearch} className="flex gap-2 mb-6">
          <Input
            value={moodQuery}
            onChange={(e) => setMoodQuery(e.target.value)}
            placeholder="e.g. something like Eternal Sunshine but funnier"
          />
          <Button type="submit">Search</Button>
        </form>
      )}

      {moodSummary && <p className="text-text-muted text-sm mb-4 italic">{moodSummary}</p>}

      {statusMessage && (
        <p className="text-accent text-sm mb-4">{statusMessage}</p>
      )}

      {loading && <p className="text-text-muted">Loading...</p>}

      {!loading && results.length === 0 && query && (
        <p className="text-text-muted">No results found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((movie) => (
          <div key={movie.id} className="flex flex-col gap-2">
            <div className="relative aspect-[2/3] bg-surface">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs p-2 text-center">
                  No poster
                </div>
              )}
            </div>
            <p className="text-text text-sm font-medium line-clamp-1">
              {movie.title}
            </p>
            <div className="flex gap-2">
              <AddToWatchlistButton movie={movie} />
              <TrailerButton movieId={movie.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}