import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { CanvasBulletinBoard } from '../components/CanvasBulletinBoard'
import { LoadingScreen } from '../components/LoadingScreen'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  if (loading) return <LoadingScreen />
  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div className="h-screen bg-black">
      <div className="h-full pt-16">
        <div className="h-full relative overflow-hidden border-2 border-cyan-400/30 shadow-xl 
        shadow-cyan-400/10 bg-black">
          <CanvasBulletinBoard />
        </div>
      </div>
    </div>
  )
}