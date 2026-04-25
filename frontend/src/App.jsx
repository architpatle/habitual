import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import "./App.css";

import Today from "./pages/Today/Today";
import History from "./pages/History/History";
import Stats from "./pages/Stats/Stats";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Layout Wrapper
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="main">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="content">
          {children}
        </div>
      </div>

    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Today />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Layout>
                <Stats />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Router>
  );
};

export default App;