import { InputHTMLAttributes } from 'react'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 rounded-lg bg-surface text-text placeholder:text-text-muted border border-border focus:outline-none focus:border-accent ${props.className ?? ''}`}
    />
  )
}