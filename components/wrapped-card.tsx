'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import html2canvas from 'html2canvas-pro'
import { Button } from '@/components/ui/button'

type Props = {
  totalWatched: number
  topGenre: string
  averageRating: number | null
  highestRated: { title: string; poster_path: string | null; rating: number | null } | null
  blurb: string
  totalHours: number
  totalMinutes: number
}

export function WrappedCard({ totalWatched, topGenre, averageRating, highestRated, blurb, totalHours, totalMinutes }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)

    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#12141c' })
    const link = document.createElement('a')
    link.download = 'my-movie-wrapped.png'
    link.href = canvas.toDataURL('image/png')
    link.click()

    setDownloading(false)
  }

  return (
    <div>
      <h1 className="font-display text-4xl font-bold text-text mb-6">Your FlixWrapped</h1>

      <div ref={cardRef} className="bg-surface p-8 max-w-xl flex flex-col gap-6">
        <p className="font-display text-2xl font-bold text-accent">This Year in Flix</p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-display text-5xl font-bold text-text">{totalWatched}</p>
            <p className="text-text-muted text-sm">movies watched</p>
          </div>
          <div>
            <p className="font-display text-5xl font-bold text-text">
                {totalHours}<span className="text-2xl">h</span> {totalMinutes}<span className="text-2xl">m</span>
            </p>
            <p className="text-text-muted text-sm">total watch time</p>
            </div>
          <div>
            <p className="font-display text-5xl font-bold text-text">
              {averageRating !== null ? averageRating.toFixed(1) : '\u2014'}
            </p>
            <p className="text-text-muted text-sm">average rating</p>
          </div>
        </div>

        <div>
          <p className="text-text-muted text-sm mb-1">Top genre</p>
          <p className="font-display text-2xl font-bold text-accent">{topGenre}</p>
        </div>

        {highestRated && (
          <div className="flex gap-3 items-center">
            {highestRated.poster_path && (
              <div className="relative w-16 aspect-[2/3] shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w185${highestRated.poster_path}`}
                  alt={highestRated.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-text-muted text-sm">Highest rated</p>
              <p className="text-text font-medium">{highestRated.title}</p>
              <p className="text-accent text-sm">{highestRated.rating}/10</p>
            </div>
          </div>
        )}

        <p className="text-text italic border-t border-text-muted/20 pt-4">{blurb}</p>
      </div>

      <Button onClick={handleDownload} disabled={downloading} className="mt-6">
        {downloading ? 'Preparing image...' : 'Download as image'}
      </Button>
    </div>
  )
}