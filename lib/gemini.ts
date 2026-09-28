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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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