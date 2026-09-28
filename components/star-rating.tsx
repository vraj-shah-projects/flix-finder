'use client'

import { useState } from 'react'
import { rateMovie } from '@/app/watchlist/actions'

export function StarRating({ itemId, initialRating }: { itemId: string; initialRating: number | null }) {
  const [rating, setRating] = useState(initialRating ?? 0)
  const [hovered, setHovered] = useState<number | null>(null)

  async function handleClick(value: number) {
    setRating(value) // optimistic update
    await rateMovie(itemId, value)
  }

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(null)}
          className="text-lg leading-none"
          aria-label={`Rate ${value} out of 10`}
        >
          <span className={(hovered ?? rating) >= value ? 'text-accent' : 'text-text-muted/30'}>
            {'\u2605'}
          </span>
        </button>
      ))}
    </div>
  )
}