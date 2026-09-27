import { createClient } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <SignOutButton />
    </div>
  )
}