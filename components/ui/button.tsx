import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'h-9 px-4 rounded-lg font-body text-sm font-medium transition-colors flex items-center justify-center'
  const styles =
    variant === 'primary'
      ? 'bg-accent text-bg hover:bg-accent/90'
      : 'bg-transparent text-text border border-border hover:border-text-muted'

  return <button className={`${base} ${styles} ${className}`} {...props} />
}