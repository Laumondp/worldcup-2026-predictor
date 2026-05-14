import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Predictions from './pages/Predictions'
import Teams from './pages/Teams'
import Groups from './pages/Groups'
import Bracket from './pages/Bracket'
import History from './pages/History'
import Rankings from './pages/Rankings'
import Calendar from './pages/Calendar'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="teams" element={<Teams />} />
            <Route path="groups" element={<Groups />} />
            <Route path="bracket" element={<Bracket />} />
            <Route path="history" element={<History />} />
            <Route path="rankings" element={<Rankings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
