import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Eye, Home, User, MessageCircle } from 'lucide-react'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const handleProfile = () => {
    navigate('/profile')
    setShowProfileMenu(false)
  }

  const handleHome = () => {
    navigate('/home')
  }

  const handleChat = () => {
    navigate('/chat')
  }

  // Don't show navbar on landing page
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav className="w-full bg-black border-b border-cyan-400/30 px-4 py-3 flex items-center justify-between">
      {/* Left side - Logo and navigation */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Eye className="w-8 h-8 text-cyan-400" />
          <span className="text-xl font-bold text-white">Perceptr</span>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHome}
              className={`text-white hover:text-cyan-400 hover:bg-cyan-400/10 ${
                location.pathname === '/home' ? 'text-cyan-400 bg-cyan-400/10' : ''
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Board
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChat}
              className={`text-white hover:text-cyan-400 hover:bg-cyan-400/10 ${
                location.pathname === '/chat' ? 'text-cyan-400 bg-cyan-400/10' : ''
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        )}
      </div>

      {/* Right side - User profile */}
      {user && (
        <div className="relative">
          <div className="flex items-center space-x-3">
            <span className="text-white text-sm hidden sm:block">
              Welcome, {user.name}
            </span>
            {user.picture && (
              <img
                src={user.picture}
                width={40}
                height={40}
                alt="Profile"
                className="rounded-full cursor-pointer border-2 border-cyan-400/30 hover:border-cyan-400 transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              />
            )}
          </div>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-cyan-400/30 rounded-lg shadow-lg overflow-hidden z-50">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-white hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors"
                onClick={handleProfile}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-white hover:bg-red-400/10 hover:text-red-400 transition-colors"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}