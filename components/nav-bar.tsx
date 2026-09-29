'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ListVideo, BarChart2, Sparkles, Gift, Clapperboard, User } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'

const links = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/dashboard', label: 'Watchlist', icon: ListVideo },
  { href: '/stats', label: 'Stats', icon: BarChart2 },
  { href: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/wrapped', label: 'Wrapped', icon: Gift },
]

export function NavBar({ email }: { email?: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Clapperboard className="w-5 h-5 text-accent" />
          <span className="font-display text-lg font-bold text-text">Flix Finder</span>
        </div>

        <div className="flex gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-surface text-text' : 'text-text-muted hover:text-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {email && (
          <div className="flex items-center gap-1.5 text-text-muted text-sm">
            <User className="w-4 h-4" />
            {email}
          </div>
        )}
        <SignOutButton />
      </div>
    </nav>
  )
}