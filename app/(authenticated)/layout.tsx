import { createClient } from '@/lib/supabase/server'
import { NavBar } from '@/components/nav-bar'

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: authData } = await supabase.auth.getClaims()

  return (
    <div className="min-h-screen bg-bg">
      <NavBar email={authData?.claims?.email} />
      <div className="px-4 py-8 max-w-5xl mx-auto">{children}</div>
    </div>
  )
}