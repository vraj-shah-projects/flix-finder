import { NextRequest, NextResponse } from 'next/server'
import { getMovieTrailerKey } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('movieId')

  if (!movieId) {
    return NextResponse.json({ error: 'Missing movieId' }, { status: 400 })
  }

  const key = await getMovieTrailerKey(Number(movieId))
  return NextResponse.json({ key })
}