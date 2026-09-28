'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { genreIdsToNames, type TmdbMovie } from '@/lib/tmdb'

export async function addToWatchlist(movie: TmdbMovie) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  if (authError || !userId) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.from('watchlist_items').insert({
    user_id: userId,
    tmdb_id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    genres: genreIdsToNames(movie.genre_ids),
  })

  if (error) {
    // unique constraint violation = already on the watchlist
    if (error.code === '23505') {
      return { error: 'Already in your watchlist' }
    }
    return { error: 'Could not add movie' }
  }

  revalidatePath('/watchlist')
  return { success: true }
}

export async function markAsWatched(itemId: string) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  if (!userId) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('watchlist_items')
    .update({ status: 'watched', watched_at: new Date().toISOString() })
    .eq('id', itemId)
    .eq('user_id', userId) // belt-and-braces; RLS already enforces this

  if (error) return { error: 'Could not update' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function rateMovie(itemId: string, rating: number) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  if (!userId) return { error: 'Not authenticated' }
  if (rating < 1 || rating > 10) return { error: 'Invalid rating' }

  const { error } = await supabase
    .from('watchlist_items')
    .update({ rating })
    .eq('id', itemId)
    .eq('user_id', userId)

  if (error) return { error: 'Could not rate' }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function removeFromWatchlist(itemId: string) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const userId = authData?.claims?.sub

  if (!userId) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('watchlist_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)

  if (error) return { error: 'Could not remove' }

  revalidatePath('/dashboard')
  return { success: true }
}