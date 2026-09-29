'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function WatchProviders({ movieId }: { movieId: number }) {
  const [providers, setProviders] = useState<{ provider_name: string; logo_path: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(`/api/tmdb/watch-providers?movieId=${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setProviders(data.flatrate ?? [])
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [movieId])

  if (loading) {
    return (
      <div className="flex gap-1">
        <div className="w-6 h-6 rounded-sm bg-surface animate-pulse" />
        <div className="w-6 h-6 rounded-sm bg-surface animate-pulse" />
      </div>
    )
  }

  if (providers.length === 0) return null

  return (
    <div className="flex gap-1 flex-wrap">
      {providers.slice(0, 4).map((p) => (
        <div key={p.provider_name} className="relative w-6 h-6 rounded-sm overflow-hidden" title={p.provider_name}>
          <Image src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} fill sizes="24px" />
        </div>
      ))}
    </div>
  )
}