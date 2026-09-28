import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl font-bold text-text mb-1">
          Welcome back
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Sign in to your watchlist
        </p>

        {error && (
          <p className="text-accent-red text-sm mb-4">{error}</p>
        )}

        <form className="flex flex-col gap-3">
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required />

          <div className="flex gap-2 mt-2">
            <Button formAction={login} className="flex-1">
              Log in
            </Button>
            <Button formAction={signup} variant="ghost" className="flex-1">
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}