'use client'

import { useEffect, useState } from 'react'
import IntroScreen from '@/components/IntroScreen'
import MainLayout from '@/components/MainLayout'

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Skip intro if already seen in this session
    const seen = sessionStorage.getItem('cl-alzz-intro')
    if (seen) setIntroComplete(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="crt-overlay">
      {!introComplete ? (
        <IntroScreen onComplete={() => {
          sessionStorage.setItem('cl-alzz-intro', '1')
          setIntroComplete(true)
        }} />
      ) : (
        <MainLayout />
      )}
    </div>
  )
}
