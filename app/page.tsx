'use client'

import React, { useEffect } from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import Edge from '@/components/sections/Edge'
import Contact from '@/components/sections/Contact'
import ScrollProgress from '@/components/ui/ScrollProgress'
import Preloader from '@/components/ui/Preloader'
import Cursor from '@/components/ui/Cursor'


export default function Home() {
  useEffect(() => {
    // Force the browser to start at the top on refresh
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <div className="bg-blur blur1" aria-hidden="true" />
      <div className="bg-blur blur2" aria-hidden="true" />
      <Preloader />
      <ScrollProgress />
      <Cursor />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <Services />
        <Work />
        <Edge />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
