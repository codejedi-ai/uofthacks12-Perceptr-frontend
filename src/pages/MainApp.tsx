import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  maxAttendees: number
  category: string
  x: number
  y: number
  color: string
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Talk: AI in Healthcare',
    description: 'Join us for an insightful discussion about the future of AI in healthcare with industry experts.',
    date: '2025-01-20',
    time: '7:00 PM',
    location: 'DC 1350',
    attendees: 45,
    maxAttendees: 100,
    category: 'Tech',
    x: 150,
    y: 120,
    color: '#3b82f6'
  },
  {
    id: '2',
    title: 'Winter Social Mixer',
    description: 'Meet new people and enjoy hot chocolate while networking with fellow students.',
    date: '2025-01-22',
    time: '6:30 PM',
    location: 'SLC Great Hall',
    attendees: 78,
    maxAttendees: 150,
    category: 'Social',
    x: 400,
    y: 200,
    color: '#ec4899'
  },
  {
    id: '3',
    title: 'Hackathon Prep Workshop',
    description: 'Get ready for upcoming hackathons with tips, tricks, and team formation.',
    date: '2025-01-25',
    time: '2:00 PM',
    location: 'E7 4053',
    attendees: 32,
    maxAttendees: 60,
    category: 'Workshop',
    x: 650,
    y: 150,
    color: '#10b981'
  },
  {
    id: '4',
    title: 'Game Night Extravaganza',
    description: 'Board games, video games, and pizza! Come hang out and have fun.',
    date: '2025-01-27',
    time: '8:00 PM',
    location: 'MC Comfy Lounge',
    attendees: 23,
    maxAttendees: 40,
    category: 'Gaming',
    x: 300,
    y: 350,
    color: '#8b5cf6'
  }
]

export default function MainApp() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    drawCanvas()
  }, [user, events, navigate])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with dark background
    ctx.fillStyle = '#1f2937'
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
      // Event card background
      const gradient = ctx.createLinearGradient(event.x - 80, event.y - 60, event.x + 80, event.y + 60)
      gradient.addColorStop(0, event.color)
      gradient.addColorStop(1, event.color + '80')
      
      ctx.fillStyle = gradient
      ctx.fillRect(event.x - 80, event.y - 60, 160, 120)
      
      // Event card border
      ctx.strokeStyle = event.color
      ctx.lineWidth = 2
      ctx.strokeRect(event.x - 80, event.y - 60, 160, 120)
      
      // Event content
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      
      // Title (truncated)
      const title = event.title.length > 18 ? event.title.substring(0, 18) + '...' : event.title
      ctx.fillText(title, event.x, event.y - 30)
      
      // Category
      ctx.font = '10px Arial'
      ctx.fillStyle = '#e5e7eb'
      ctx.fillText(event.category, event.x, event.y - 15)
      
      // Date and time
      ctx.fillText(`${event.date} ${event.time}`, event.x, event.y)
      
      // Location
      ctx.fillText(event.location, event.x, event.y + 15)
      
      // Attendees
      ctx.fillText(`${event.attendees}/${event.maxAttendees} attending`, event.x, event.y + 30)
      
      // Event icon
      ctx.font = '16px Arial'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('🎉', event.x, event.y + 50)
    })
  }

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
    
    const clickedEvent = events.find(event => {
      return coords.x >= event.x - 80 && coords.x <= event.x + 80 &&
             coords.y >= event.y - 60 && coords.y <= event.y + 60
    })

    setSelectedEvent(clickedEvent || null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e)
    
    const clickedEvent = events.find(event => {
      return coords.x >= event.x - 80 && coords.x <= event.x + 80 &&
             coords.y >= event.y - 60 && coords.y <= event.y + 60
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

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">UW-Rizzlers</h1>
              <span className="ml-2 text-2xl">🎉</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-gray-600 text-white hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </Button>
              
              <div className="relative">
                {user.picture && (
                  <img
                    src={user.picture}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="rounded-full cursor-pointer border-2 border-gray-600 hover:border-gray-500 transition-colors"
                    onClick={() => setShowMenu(!showMenu)}
                  />
                )}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">Campus Events Canvas</h2>
            <p className="text-gray-400">Click and drag events around the canvas. Click on an event to view details.</p>
          </div>
          
          <canvas
            ref={canvasRef}
            width={1000}
            height={600}
            className="border border-gray-600 rounded-lg shadow-lg cursor-pointer bg-gray-800"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>

        {/* Event Details Sidebar */}
        {selectedEvent && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedEvent.title}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedEvent.category}
              </span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {selectedEvent.date} at {selectedEvent.time}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                {selectedEvent.location}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                {selectedEvent.attendees}/{selectedEvent.maxAttendees} attending
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-6">{selectedEvent.description}</p>
            
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Button className="w-full">
              Join Event
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedEvent(null)}
            >
              Close Details
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}