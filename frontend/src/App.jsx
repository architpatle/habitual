import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./app.css";

import Today from "./pages/Today/Today";
import History from "./pages/History/History";
import Stats from "./pages/Stats/Stats";
import Login from "./pages/Login/Login";

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

// 🔐 Route Guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// 🧱 Layout Wrapper (only for authenticated pages)
const ProtectedLayout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
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

        {/* 🔓 Public Route */}
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Today />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <History />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/stats"
          element={
            <PrivateRoute>
              <ProtectedLayout>
                <Stats />
              </ProtectedLayout>
            </PrivateRoute>
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
