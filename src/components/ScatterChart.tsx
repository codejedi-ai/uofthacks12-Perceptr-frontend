import { useState, useEffect, useRef, useCallback } from 'react'
import { RotateCw, Music, Calendar, Users, Zap, Eye, Palette } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import emailIcon from '/email.png'
import instagramIcon from '/instagram.png'
import discordIcon from '/discord.png'

interface UserData {
  x: number
  y: number
  name: string
  email: string
  instagram: string
  discord: string
  id: string
}

interface CanvasEvent {
  id: string
  x: number
  y: number
  title: string
  description: string
  color: string
  type: 'chill' | 'energetic' | 'mysterious' | 'euphoric' | 'melancholic' | 'intense'
  vibe: string
  playlistUrl: string
  date: string
  isDragging?: boolean
}

export function ScatterChart() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [data, setData] = useState<UserData[]>([])
  const [events, setEvents] = useState<CanvasEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showEventForm, setShowEventForm] = useState(false)
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    description: '', 
    color: '#ff6b6b',
    type: 'chill' as 'chill' | 'energetic' | 'mysterious' | 'euphoric' | 'melancholic' | 'intense',
    vibe: '',
    playlistUrl: '',
    date: ''
  })

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`https://7503-199-7-156-226.ngrok-free.app/query?userId=${user?.sub}`)
      const embeddingsData = await response.json()
      
      const transformedData = await Promise.all(
        embeddingsData.labels.map(async (label: string, index: number) => {
          try {
            const userResponse = await fetch(`https://7503-199-7-156-226.ngrok-free.app/find_document?userId=${label}`)
            const userDetails = await userResponse.json()
            const userData = userDetails.results[label]
      
            if (!userData) {
              return {
                x: embeddingsData.embeddings_2d[index][0] * 100 + 400,
                y: embeddingsData.embeddings_2d[index][1] * 100 + 300,
                name: 'Unknown User',
                email: '',
                instagram: '',
                discord: '',
                id: label,
              }
            }
      
            return {
              x: embeddingsData.embeddings_2d[index][0] * 100 + 400,
              y: embeddingsData.embeddings_2d[index][1] * 100 + 300,
              name: userData.name || 'Unknown',
              email: userData.email || '',
              instagram: userData.social1 || '',
              discord: userData.social2 || '',
              id: label,
            }
          } catch (error) {
            console.error(`Error fetching user data for ${label}:`, error)
            return {
              x: embeddingsData.embeddings_2d[index][0] * 100 + 400,
              y: embeddingsData.embeddings_2d[index][1] * 100 + 300,
              name: 'Error Loading User',
              email: '',
              instagram: '',
              discord: '',
              id: label,
            }
          }
        })
      )

      setData(transformedData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw events
    events.forEach(event => {
      // Draw event background with gradient
      const gradient = ctx.createLinearGradient(event.x - 40, event.y - 20, event.x + 40, event.y + 20)
      gradient.addColorStop(0, event.color)
      gradient.addColorStop(1, event.color + '80')
      
      ctx.fillStyle = gradient
      ctx.fillRect(event.x - 40, event.y - 20, 80, 40)
      
      // Draw border
      ctx.strokeStyle = event.color
      ctx.lineWidth = 2
      ctx.strokeRect(event.x - 40, event.y - 20, 80, 40)
      
      // Draw music note icon
      ctx.fillStyle = '#ffffff'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      const vibeEmoji = event.type === 'chill' ? '😌' : 
                       event.type === 'energetic' ? '⚡' :
                       event.type === 'mysterious' ? '🌙' :
                       event.type === 'euphoric' ? '✨' :
                       event.type === 'melancholic' ? '🌧️' : '🔥'
      ctx.fillText(vibeEmoji, event.x - 25, event.y + 5)
      
      // Draw event title
      ctx.font = '10px Arial'
      ctx.fillText(event.title, event.x + 5, event.y - 5)
      ctx.fillText(event.type, event.x + 5, event.y + 8)
    })

    // Draw users
    data.forEach(userData => {
      const isCurrentUser = userData.email === user?.email
      
      // Draw user circle
      ctx.beginPath()
      ctx.arc(userData.x, userData.y, 20, 0, 2 * Math.PI)
      ctx.fillStyle = isCurrentUser ? 'rgba(255, 215, 0, 0.8)' : 'rgba(138, 43, 226, 0.6)'
      ctx.fill()
      ctx.strokeStyle = isCurrentUser ? 'rgb(255, 215, 0)' : 'rgb(138, 43, 226)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw emoji
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(isCurrentUser ? '👁️' : '🎭', userData.x, userData.y + 7)
    })
  }, [data, events, user])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    
    // Check if clicked on a user
    const clickedUser = data.find(userData => {
      const distance = Math.sqrt(
        Math.pow(coords.x - userData.x, 2) + Math.pow(coords.y - userData.y, 2)
      )
      return distance <= 20
    })

    if (clickedUser) {
      setSelectedUser(clickedUser)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    
    // Check if clicked on an event
    const clickedEvent = events.find(event => {
      return coords.x >= event.x - 40 && coords.x <= event.x + 40 &&
             coords.y >= event.y - 20 && coords.y <= event.y + 20
    })

    if (clickedEvent) {
      setDraggedEvent(clickedEvent.id)
      setDragOffset({
        x: coords.x - clickedEvent.x,
        y: coords.y - clickedEvent.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedEvent) return

    const coords = getCanvasCoordinates(e)
    setEvents(prev => prev.map(event => 
      event.id === draggedEvent 
        ? { ...event, x: coords.x - dragOffset.x, y: coords.y - dragOffset.y }
        : event
    ))
  }

  const handleMouseUp = () => {
    setDraggedEvent(null)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleRefresh = () => {
    fetchData()
  }

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.genre.trim()) return

    const event: CanvasEvent = {
      id: Date.now().toString(),
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      title: newEvent.title,
      description: newEvent.description,
      color: newEvent.color,
      type: newEvent.type,
      genre: newEvent.genre,
      date: newEvent.date
    }

    setEvents(prev => [...prev, event])
    setNewEvent({ 
      title: '', 
      description: '', 
      color: '#ff6b6b',
      type: 'party',
      genre: '',
      date: ''
    })
    setShowEventForm(false)
  }

  const getInstagramUsername = (url: string) => {
    return url.split('instagram.com/')[1] || url
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>
  }

  return (
    <div className="relative bg-transparent pt-10">
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full bg-black border border-cyan-400/30 text-cyan-400
            hover:bg-cyan-950/50 hover:text-cyan-300
            transition-all duration-200 shadow-lg mr-4"
        >
          <RotateCw className="w-7 h-7" />
        </button>

        <button
          onClick={() => setShowEventForm(true)}
          className="px-4 py-2 rounded-full bg-purple-600 text-white
            hover:bg-purple-700 transition-all duration-200 shadow-lg mr-4 flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Create Perspective
        </button>
        
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white animate-fade pt-4">
          Your Perspective Network
        </h1>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-cyan-400/30 shadow-xl shadow-cyan-400/10 cursor-pointer"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-purple-400 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Create Event Perspective
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Event/Gathering Name</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="Midnight Reflections Gathering"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Vibe Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                >
                  <option value="chill">Chill & Relaxed</option>
                  <option value="energetic">High Energy</option>
                  <option value="mysterious">Mysterious & Deep</option>
                  <option value="euphoric">Euphoric & Uplifting</option>
                  <option value="melancholic">Melancholic & Thoughtful</option>
                  <option value="intense">Intense & Powerful</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Playlist URL (Spotify/Apple Music)</label>
                <input
                  type="text"
                  value={newEvent.playlistUrl}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, playlistUrl: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="https://open.spotify.com/playlist/..."
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Vibe Description</label>
                <input
                  type="text"
                  value={newEvent.vibe}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, vibe: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder="Dreamy, introspective, cosmic..."
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 h-20"
                  placeholder="Describe the vibe and what to expect..."
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Theme Color</label>
                <input
                  type="color"
                  value={newEvent.color}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full p-1 rounded bg-gray-800 border border-gray-600"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Host Event
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-purple-400 rounded-lg p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">🎭</div>
                <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                <p className="text-purple-300">Perspective Creator</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <img 
                    src={emailIcon}
                    alt="Email"
                    width={24}
                    height={24}
                  />
                  <a 
                    href={`mailto:${selectedUser.email}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {selectedUser.email}
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <Music className="w-6 h-6 text-green-400" />
                  <a 
                    href={selectedUser.instagram}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Playlist Profile
                  </a>
                </div>

                <div className="flex items-center space-x-3 text-gray-300">
                  <img 
                    src={instagramIcon}
                    alt="Instagram"
                    width={24}
                    height={24}
                  />
                  <a 
                    href={selectedUser.discord}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Apple Music Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}