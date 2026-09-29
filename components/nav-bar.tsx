'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'
import { Search, Bookmark, PieChart, Compass, Gift, Clapperboard, User, Sparkles } from 'lucide-react'

const links = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/dashboard', label: 'Watchlist', icon: Bookmark },
  { href: '/stats', label: 'Stats', icon: PieChart },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/wrapped', label: 'Wrapped', icon: Gift },
]

export function NavBar({ email }: { email?: string }) {
  const pathname = usePathname()

  return (
    <nav className="w-56 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Clapperboard className="w-5 h-5 text-accent" />
        <span className="font-display text-lg font-bold text-text">Flix Finder</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-surface text-text' : 'text-text-muted hover:text-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        {email && (
          <div className="flex items-center gap-1.5 text-text-muted text-xs px-2">
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        <SignOutButton />
      </div>
    </nav>
  )
}