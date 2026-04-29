import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Predictions from './pages/Predictions'
import Teams from './pages/Teams'
import Groups from './pages/Groups'
import Bracket from './pages/Bracket'
import History from './pages/History'
import Fixtures from './pages/Fixtures'
import Rankings from './pages/Rankings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="teams" element={<Teams />} />
          <Route path="groups" element={<Groups />} />
          <Route path="bracket" element={<Bracket />} />
          <Route path="history" element={<History />} />
          <Route path="fixtures" element={<Fixtures />} />
          <Route path="rankings" element={<Rankings />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}

export default App
