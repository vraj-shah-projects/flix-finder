export type TasteProfileResult = {
  tasteProfile: string
  recommendations: {
    title: string
    year: string
    reason: string
  }[]
}

type WatchedMovie = {
  title: string
  genres: string[]
  rating: number | null
}

export async function generateTasteProfile(
  watchedMovies: WatchedMovie[]
): Promise<TasteProfileResult> {
  const historyText = watchedMovies
    .map((m) => `- ${m.title} (${m.genres.join(', ')}) - rated ${m.rating ?? 'unrated'}/10`)
    .join('\n')

  const prompt = `You are a movie taste analyst. Here is a user's watch history with their ratings:

${historyText}

Based on this data, respond with ONLY a JSON object (no markdown, no code fences) in this exact shape:
{
  "tasteProfile": "1-2 sentences characterizing what this user likes, referencing patterns in their ratings.",
  "recommendations": [
    { "title": "Movie Title", "year": "YYYY", "reason": "One sentence referencing specific movies from their history." }
  ]
}

Give between 3 and 5 recommendations. Do not recommend movies already in their watch history.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status}`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Gemini returned no content')
  }

  return JSON.parse(text)
}

const KNOWN_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
]

export async function interpretMoodQuery(mood: string): Promise<{ genreNames: string[]; summary: string }> {
  const prompt = `A user wants movie suggestions matching this mood/vibe description: "${mood}"

Choose 1-3 genres from this exact list that best fit: ${KNOWN_GENRES.join(', ')}

Respond with ONLY a JSON object (no markdown, no code fences):
{
  "genreNames": ["Genre1", "Genre2"],
  "summary": "One short friendly sentence about what kind of movies you're suggesting and why, referencing their mood description."
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`)

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned no content')

  return JSON.parse(text)
}

export async function generateWrappedBlurb(watchedMovies: {
  title: string
  genres: string[]
  rating: number | null
}[]): Promise<{ blurb: string }> {
  const historyText = watchedMovies
    .map((m) => `- ${m.title} (${m.genres.join(', ')}) - rated ${m.rating ?? 'unrated'}/10`)
    .join('\n')

  const prompt = `Here is a user's full movie watch history for the year:

${historyText}

Write ONE punchy, fun sentence (like a Spotify Wrapped caption) that captures their viewing personality this year. Playful tone is good. Respond with ONLY a JSON object, no markdown:
{ "blurb": "your one sentence here" }`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) throw new Error(`Gemini request failed: ${res.status}`)

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini returned no content')

  return JSON.parse(text)
}