import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Today from "./pages/Today/Today";
import History from "./pages/History/History";
import Stats from "./pages/Stats/Stats";
// import Login from "./pages/Login/Login"; ❌ removed

import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";

// 🧱 Layout Wrapper (applies to all pages now)
const Layout = ({ children }) => {
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

        {/* 🟢 Direct Routes (No Auth) */}
        <Route
          path="/"
          element={
            <Layout>
              <Today />
            </Layout>
          }
        />

        <Route
          path="/history"
          element={
            <Layout>
              <History />
            </Layout>
          }
        />

        <Route
          path="/stats"
          element={
            <Layout>
              <Stats />
            </Layout>
          }
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;