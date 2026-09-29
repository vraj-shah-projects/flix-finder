import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/components/nav-bar'

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()

  return (
    <div className="min-h-screen bg-bg flex">
      <NavBar email={authData?.claims?.email} />
      <div className="flex-1 px-8 py-8 max-w-5xl mx-auto">{children}</div>
    </div>
  )
}