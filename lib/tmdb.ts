const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// TMDB's genre IDs are stable and rarely change, so hardcoding avoids
// an extra API call on every search.
const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
}

export function genreIdsToNames(ids: number[]): string[] {
  return ids.map((id) => GENRE_MAP[id]).filter(Boolean)
}

export type TmdbMovie = {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  genre_ids: number[]
}

export async function searchMovies(query: string): Promise<TmdbMovie[]> {
  const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`)
  }

  const data = await res.json()
  return data.results
}

export async function getPopularMovies(): Promise<TmdbMovie[]> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/popular`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) throw new Error(`TMDB popular fetch failed: ${res.status}`)

  const data = await res.json()
  return data.results
}

export async function findMovieByTitleAndYear(
  title: string,
  year: string
): Promise<TmdbMovie | null> {
  const url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(title)}&year=${year}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.results?.[0] ?? null
}