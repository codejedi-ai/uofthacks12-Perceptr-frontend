import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ChatButton() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/chat')
  }

  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200"
      aria-label="Go to Chatroom"
    >
      <MessageCircle className="w-6 h-6 text-black" />
    </button>
  )
}