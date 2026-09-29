'use client'

import { useEffect, useState } from 'react'

export function TrailerButton({ movieId }: { movieId: number }) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/tmdb/trailer?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setTrailerKey(data.key ?? null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [movieId])

  if (loading) {
    return <div className="w-9 h-9 shrink-0 rounded-md bg-surface animate-pulse" />
  }

  if (!trailerKey) return null

  return (
    <a
      href={`https://www.youtube.com/watch?v=${trailerKey}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-9 h-9 shrink-0 rounded-md bg-accent-red text-text hover:bg-accent-red/90"
      aria-label="Watch trailer"
    >
      {'\u25B6'}
    </a>
  )
}