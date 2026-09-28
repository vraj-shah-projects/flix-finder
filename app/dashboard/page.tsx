import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out-button'
import { StarRating } from '@/components/star-rating'
import { markAsWatched, removeFromWatchlist } from '@/app/watchlist/actions'
import Image from 'next/image'

async function markAsWatchedForm(itemId: string) {
  'use server'
  await markAsWatched(itemId)
}

async function removeFromWatchlistForm(itemId: string) {
  'use server'
  await removeFromWatchlist(itemId)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()
  const user = authData?.claims

  const { data: items } = await supabase
    .from('watchlist_items')
    .select('*')
    .eq('user_id', user?.sub)
    .order('added_at', { ascending: false })

  const watching = items?.filter((i) => i.status === 'watchlist') ?? []
  const watched = items?.filter((i) => i.status === 'watched') ?? []

  return (
    <div className="min-h-screen bg-bg px-4 py-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-text">My Watchlist</h1>
          <p className="text-text-muted text-sm">Signed in as {user?.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mb-10">
        <h2 className="font-display text-2xl font-bold text-text mb-4">
          Watching ({watching.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watching.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="relative aspect-[2/3] bg-surface">
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-text text-sm font-medium line-clamp-1">{item.title}</p>
              <form action={markAsWatchedForm.bind(null, item.id)}>
                <button className="text-xs text-accent">Mark as watched</button>
              </form>
              <form action={removeFromWatchlistForm.bind(null, item.id)}>
                <button className="text-xs text-accent-red">Remove</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold text-text mb-4">
          Watched ({watched.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watched.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="relative aspect-[2/3] bg-surface">
                {item.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                )}
              </div>
              <p className="text-text text-sm font-medium line-clamp-1">{item.title}</p>
              <StarRating itemId={item.id} initialRating={item.rating} />
              <form action={removeFromWatchlistForm.bind(null, item.id)}>
                <button className="text-xs text-accent-red">Remove</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}