'use client'

import { useContext } from 'react'
import { LenisContext } from '@/components/layout/Providers'

export function useLenis() {
  return useContext(LenisContext)
}
