import { NextRequest, NextResponse } from 'next/server'
import { interpretMoodQuery } from '@/lib/gemini'
import { genreNamesToIds, discoverMoviesByGenres } from '@/lib/tmdb'

export async function POST(request: NextRequest) {
  const { mood } = await request.json()

  if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
    return NextResponse.json({ error: 'Missing mood description' }, { status: 400 })
  }

  try {
    const { genreNames, summary } = await interpretMoodQuery(mood)
    const genreIds = genreNamesToIds(genreNames)

    if (genreIds.length === 0) {
      return NextResponse.json({ error: 'Could not understand that mood' }, { status: 422 })
    }

    const movies = await discoverMoviesByGenres(genreIds)
    return NextResponse.json({ movies: movies.slice(0, 20), summary })
  } catch (error) {
    console.error('Mood search error:', error)
    return NextResponse.json({ error: 'Mood search failed' }, { status: 502 })
  }
}