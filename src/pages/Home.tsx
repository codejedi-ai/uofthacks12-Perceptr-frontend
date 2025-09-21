import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ScatterChart } from '../components/ScatterChart'
import { LoadingScreen } from '../components/LoadingScreen'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  if (loading) return <LoadingScreen />
  if (!user) {
    navigate('/')
    return null
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <div className="h-screen bg-black">
      <div className="h-full">
        <div className="h-full relative overflow-hidden border-2 border-cyan-400/30 shadow-xl 
        shadow-cyan-400/10 bg-black">
          <div className="absolute top-4 right-4 z-50">
            <div className="relative">
              {user.picture && (
                <img
                  src={user.picture}
                  width={48}
                  height={48}
                  alt="Profile"
                  className="rounded-full cursor-pointer border-2"
                  onClick={() => setShowMenu(!showMenu)}
                />
              )}
              {showMenu && (
                <div className="absolute mt-2 right-0 w-36 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 
                    hover:text-cyan-600 transition-colors"
                    onClick={handleProfile}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50 
                    hover:text-cyan-600 transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
          Your Music Vibe Network 🎵
          <ScatterChart />
        </div>
      </div>
    </div>
  )
}