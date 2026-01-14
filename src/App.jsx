import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './app.css'
import Today from './pages/Today/Today'
import History from './pages/History/History'
import Status from './pages/Status/Status'
import Navbar from './components/Navbar/Navbar'
const App = () => {
  return (
    <Router>
    <Navbar />
    
    <Routes>
      <Route path="/" element={<Today />} />
      <Route path="/history" element={<History />} />
      <Route path="/status" element={<Status />} />


    </Routes>
    </Router>
  )
}

export default App