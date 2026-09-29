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

export async function getMovieTrailerKey(movieId: number): Promise<string | null> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  const videos: { key: string; site: string; type: string; official: boolean }[] = data.results ?? []

  // Prefer an official YouTube trailer, fall back to any trailer, then any teaser
  const officialTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official)
  const anyTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  const anyTeaser = videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser')

  return officialTrailer?.key ?? anyTrailer?.key ?? anyTeaser?.key ?? null
}

const NAME_TO_GENRE_ID: Record<string, number> = Object.fromEntries(
  Object.entries(GENRE_MAP).map(([id, name]) => [name.toLowerCase(), Number(id)])
)

export function genreNamesToIds(names: string[]): number[] {
  return names
    .map((name) => NAME_TO_GENRE_ID[name.toLowerCase()])
    .filter((id): id is number => id !== undefined)
}

export async function discoverMoviesByGenres(genreIds: number[]): Promise<TmdbMovie[]> {
  const genreParam = genreIds.join(',')
  const url = `${TMDB_BASE_URL}/discover/movie?with_genres=${genreParam}&sort_by=popularity.desc`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) throw new Error(`TMDB discover failed: ${res.status}`)

  const data = await res.json()
  return data.results
}

export async function getMovieRuntime(movieId: number): Promise<number | null> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  return data.runtime ?? null
}

export type WatchProvider = {
  provider_name: string
  logo_path: string
}

export async function getWatchProviders(
  movieId: number,
  region = 'AU'
): Promise<{ flatrate: WatchProvider[]; rent: WatchProvider[]; buy: WatchProvider[] } | null> {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    },
  })

  if (!res.ok) return null

  const data = await res.json()
  const regionData = data.results?.[region]

  if (!regionData) return null

  return {
    flatrate: regionData.flatrate ?? [],
    rent: regionData.rent ?? [],
    buy: regionData.buy ?? [],
  }
}