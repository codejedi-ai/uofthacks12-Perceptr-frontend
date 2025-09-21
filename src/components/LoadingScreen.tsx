import { useEffect, useState } from 'react'
import { VantaBackground } from './VantaBackground'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onLoadingComplete])

  return (
    <VantaBackground>
      <div className="flex items-center justify-center h-screen bg-black bg-opacity-50">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">UW-Rizzlers</h1>
          <p className="text-xl">Loading your campus events{dots}</p>
        </div>
      </div>
    </VantaBackground>
  )
}