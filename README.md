# 🎬 Flix Finder

A personal movie watchlist tracker - search, track, rate, and get AI-powered recommendations based on your taste.

**Name:** Vraj Shah | 
**Email:** vraj.shah.028@gmail.com | 
**Deployed project:** https://flix-finder-delta.vercel.app/

---

## Tech stack

- **Framework:** Next.js (App Router, TypeScript)
- **Database & Auth:** Supabase (Postgres + Supabase Auth)
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini (`gemini-3.5-flash-lite`)
- **Movie data:** TMDB API
- **Hosting:** Vercel
- **Icons:** Lucide
- **Charts:** Recharts
- **Image export:** html2canvas-pro

---

## Core features

### Watchlist
- Search movies by title via TMDB, or by natural-language mood (see Extras below)
- Add movies to a personal watchlist from search results
- Mark a watchlisted movie as watched, and rate it 1-10
- Mark a watched movie back to unwatched
- Remove a movie from the watchlist
- Sort (recently added, oldest, highest/lowest rated, title A-Z) and filter by genre
- Everything persisted to Supabase Postgres, scoped per user via Row Level Security

### Stats
- Total movies watched
- Average rating given
- Genre breakdown across watched movies, shown as an interactive pie chart with counts

### Authentication
- Supabase Auth, email + password
- Auth handled via `@supabase/ssr`, with separate browser/server/proxy clients following Supabase's current recommended pattern
- Every server-side check uses `supabase.auth.getClaims()` (verified against the session, not trusted from the client) - a client can never spoof another user's ID
- Row Level Security policies on every table enforce `auth.uid() = user_id` for all reads/writes, as defense in depth alongside application-level checks
- All rows are keyed by Supabase's stable `auth.users.id`, never by email

### AI taste profile & recommendations
- Server-side Gemini call takes the user's watched history (titles, genres, ratings)
- Returns a short taste-profile sentence characterizing their viewing habits
- Returns 3-5 recommended movies, each with a one-line reason referencing their specific history
- Recommended titles are re-matched against TMDB (by title + year) to attach real posters and allow adding straight to the watchlist
- Users with no watch history yet see popular movies as a fallback, rather than an AI call with nothing to work from

### Interface
- Poster grid layout throughout, dark cinema-inspired theme (custom color tokens, Manrope/Work Sans typography)
- Loading states via Next.js's `loading.tsx` convention on every authenticated route, plus per-component skeleton placeholders (trailer button, watch providers)
- Left sidebar navigation with active-page highlighting

---

## Extra features (beyond the brief's core requirements)

Rather than building the optional friend system extension, I built a set of features more specific to this app's identity as a personal movie companion:

1. **Natural-language mood search** - describe a vibe ("something like Eternal Sunshine but funnier") and Gemini maps it to TMDB genres, which are then used to query TMDB's `/discover/movie` endpoint.
2. **Trailer quick-link** - a small icon-only button next to each poster that opens the movie's YouTube trailer directly, only shown when TMDB actually has trailer data for that title.
3. **Streaming availability** - shows which subscription services (Netflix, Stan, etc.) currently have a movie available to stream, via TMDB's watch-providers endpoint.
4. **"Wrapped" year-in-review** - a Spotify-Wrapped-style recap card (total watched, total watch time, average rating, top genre, highest-rated pick, an AI-written one-line summary of your year), downloadable as a shareable PNG image.

---

## Assumptions & simplifications

- **Movies only**, no TV shows - per the brief's stated scope.
- **Email confirmation is currently disabled** in Supabase Auth. Supabase's built-in email sender is rate-limited and not intended for production use; wiring up a real SMTP provider (e.g. Resend) was considered but left out of scope for this submission. This is a deliberate simplification, not an oversight - noted here as instructed by the brief.
- **Genres are stored as a Postgres `text[]` array** on each watchlist row, rather than normalized into a separate `genres` table with a join table. Given a single user's watchlist is never especially large, and genres are never queried independently of a movie, this kept the schema simpler without a meaningful cost.
- **A unique constraint on `(user_id, tmdb_id)`** prevents the same movie being added twice to one user's watchlist, enforced at the database level rather than only in application code.
- **Ratings are constrained to 1-10 via a database `check` constraint**, so an invalid value can never be persisted even if a bug elsewhere in the app tried to send one.
- **Watch-provider region is hardcoded to `AU`.** TMDB's streaming availability data is region-specific; a production version would detect the user's actual region rather than assuming one.
- **"Total watch time" on the Wrapped page only reflects movies added after the `runtime` column was introduced.** Movies added earlier in development contribute 0 minutes to the total until removed and re-added. This is a known, accepted limitation rather than something worth a one-off backfill script for a take-home.
- **AI-recommended movies that can't be confidently re-matched against TMDB (by title + release year) are silently dropped** from the recommendations list, rather than shown with broken/missing poster data.
- **Mood search is constrained to a fixed, known list of TMDB genre names** when interpreting a free-text mood query, so the AI's output always maps cleanly onto real TMDB genre IDs rather than risking unmatched free-form keywords.
- **No TMDB caching, proxying, or rate-limit handling** - per the brief's stated scope, a visible error state is considered sufficient.
- **The optional friend system extension was intentionally not built**, in favor of the creative extras listed above - the brief explicitly allows substituting other creative features in its place.
---