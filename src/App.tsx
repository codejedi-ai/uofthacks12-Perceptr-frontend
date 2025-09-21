import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { AudioButton } from './components/AudioButton'
import { ChatButton } from './components/ChatButton'
import { Navbar } from './components/Navbar'
import Home from './pages/Home'
import Survey from './pages/Survey'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Landing from './pages/Landing'

export function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}
    >
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <AudioButton />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  )
}