import type { LucideIcon } from 'lucide-react'

export interface Service {
  id: string
  title: string
  tagline: string
  body: string
  tags: string[]
  size: 'large' | 'tall' | 'full'
  variant: 'gradient' | 'glass' | 'dark'
  icon: LucideIcon
}
