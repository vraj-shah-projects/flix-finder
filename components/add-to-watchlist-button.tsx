'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { addToWatchlist } from '@/app/watchlist/actions'
import type { TmdbMovie } from '@/lib/tmdb'

export function AddToWatchlistButton({ movie }: { movie: TmdbMovie }) {
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    const result = await addToWatchlist(movie)

    if (result.error) {
      setError(result.error)
    } else {
      setAdded(true)
    }
  }

  return (
  <div className="flex-1 min-w-0">
    <Button
      onClick={handleAdd}
      disabled={added}
      variant={added ? 'ghost' : 'primary'}
      className="text-xs w-full"
    >
      {added ? "Added \u2714" : 'Watch +'}
    </Button>
    {error && <p className="text-accent-red text-xs mt-1">{error}</p>}
  </div>
    )
}