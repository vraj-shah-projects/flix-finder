import { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-lg border border-dashed border-border">
      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-text-muted" />
      </div>
      <p className="text-text font-medium mb-1">{title}</p>
      <p className="text-text-muted text-sm max-w-sm">{description}</p>
    </div>
  )
}