import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import OneOnOneTracker from './pages/OneOnOneTracker'
import AdminTodos from './pages/AdminTodos'
import AdminFeedback from './pages/AdminFeedback'
import FeedbackCenter from './pages/FeedbackCenter'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/one-on-one-tracker" 
              element={
                <ProtectedRoute>
                  <OneOnOneTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/todos" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminTodos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/feedback" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminFeedback />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/feedback-center" 
              element={
                <ProtectedRoute>
                  <FeedbackCenter />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

