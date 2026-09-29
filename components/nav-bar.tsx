'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'

const links = [
  { href: '/dashboard', label: 'Watchlist' },
  { href: '/search', label: 'Search' },
  { href: '/stats', label: 'Stats' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/wrapped', label: 'Wrapped' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-4 py-4 border-b border-text-muted/20 mb-8">
      <div className="flex gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-surface text-text'
                  : 'text-text-muted hover:text-accent'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
      <SignOutButton />
    </nav>
  )
}