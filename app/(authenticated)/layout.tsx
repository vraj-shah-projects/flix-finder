import { NavBar } from '@/components/nav-bar'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      <div className="px-4 py-8 max-w-5xl mx-auto">{children}</div>
    </div>
  )
}