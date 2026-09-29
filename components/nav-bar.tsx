'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bookmark, PieChart, Compass, Gift, Clapperboard, User, LogOut } from 'lucide-react'
import { signout } from '@/app/login/actions'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/dashboard', label: 'Watchlist', icon: Bookmark },
  { href: '/stats', label: 'Stats', icon: PieChart },
  { href: '/recommendations', label: 'Recommendations', icon: Compass },
  { href: '/wrapped', label: 'Wrapped', icon: Gift },
]

export function NavBar({ email }: { email?: string }) {
  const pathname = usePathname()

  return (
    <nav className="w-16 sm:w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border px-2 sm:px-4 py-6">
      <div className="flex items-center justify-center sm:justify-start gap-2 mb-8 px-0 sm:px-2">
        <Clapperboard className="w-5 h-5 text-accent shrink-0" />
        <span className="hidden sm:inline font-display text-lg font-bold text-text">Flix Finder</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`flex items-center justify-center sm:justify-start gap-2.5 text-sm font-medium px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-surface text-text' : 'text-text-muted hover:text-accent'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        {email && (
          <div className="hidden sm:flex items-center gap-1.5 text-text-muted text-xs px-2">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        <form action={signout}>
          <Button type="submit" variant="ghost" title="Sign out" className="w-full gap-2 justify-center sm:justify-start">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </nav>
  )
}