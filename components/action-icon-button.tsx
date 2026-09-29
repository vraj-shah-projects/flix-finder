'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LucideIcon, Loader2 } from 'lucide-react'

type Props = {
  icon: LucideIcon
  label: string
  onAction: () => Promise<unknown>
  variant?: 'default' | 'danger' | 'accent' | 'info'
}

const variantStyles = {
  default: 'text-text-muted hover:text-accent hover:bg-surface',
  danger: 'text-text-muted hover:text-accent-red hover:bg-accent-red/10',
  accent: 'text-text-muted hover:text-accent hover:bg-accent/10',
  info: 'text-text-muted hover:text-blue-400 hover:bg-blue-400/10',
}

export function ActionIconButton({ icon: Icon, label, onAction, variant = 'default' }: Props) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      await onAction()
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={label}
      className={`flex items-center gap-1.5 text-xs font-medium font-body px-2 py-1.5 rounded-md transition-colors disabled:opacity-50 ${variantStyles[variant]}`}
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  )
}