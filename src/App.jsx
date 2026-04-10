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
import AdminUsers from './pages/AdminUsers'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminRequirements from './pages/AdminRequirements'
import BrotherDirectory from './pages/BrotherDirectory'
import FeedbackCenter from './pages/FeedbackCenter'
import Resources from './pages/Resources'
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
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/requirements" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminRequirements />
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
            <Route 
              path="/directory" 
              element={
                <ProtectedRoute>
                  <BrotherDirectory />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
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

