import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './app.css'
import Today from './pages/Today/Today'
import History from './pages/History/History'
import Status from './pages/Status/Status'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'

const App = () => {
  return (
    <Router>
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Today />} />
              <Route path="/history" element={<History />} />
              <Route path="/status" element={<Status />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
