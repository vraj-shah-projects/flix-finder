'use client'

import { useState } from 'react'

export function TrailerButton({ movieId }: { movieId: number }) {
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleClick() {
    setLoading(true)
    setNotFound(false)

    const res = await fetch(`/api/tmdb/trailer?movieId=${movieId}`)
    const data = await res.json()

    setLoading(false)

    if (data.key) {
      window.open(`https://www.youtube.com/watch?v=${data.key}`, '_blank')
    } else {
      setNotFound(true)
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className="text-xs text-text-muted hover:text-accent">
        {loading ? 'Loading...' : `${'\u25B6'} Trailer`}
      </button>
      {notFound && <p className="text-text-muted text-xs">No trailer found</p>}
    </div>
  )
}