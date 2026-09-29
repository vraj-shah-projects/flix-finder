import Link from 'next/link'
import { SignOutButton } from '@/components/sign-out-button'

const links = [
  { href: '/dashboard', label: 'Watchlist' },
  { href: '/search', label: 'Search' },
  { href: '/stats', label: 'Stats' },
  { href: '/recommendations', label: 'Recommendations' },
]

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-4 border-b border-text-muted/20 mb-8">
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-text-muted hover:text-accent text-sm font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <SignOutButton />
    </nav>
  )
}