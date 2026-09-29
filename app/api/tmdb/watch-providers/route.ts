import { NextRequest, NextResponse } from 'next/server'
import { getWatchProviders } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('movieId')

  if (!movieId) {
    return NextResponse.json({ error: 'Missing movieId' }, { status: 400 })
  }

  const providers = await getWatchProviders(Number(movieId))
  return NextResponse.json(providers ?? { flatrate: [], rent: [], buy: [] })
}