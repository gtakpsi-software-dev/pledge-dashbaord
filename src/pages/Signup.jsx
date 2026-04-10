import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Signup() {
  const navigate = useNavigate()
  const { signup, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    pledgeClass: ''
  })
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    const { confirmPassword, ...signupData } = formData
    const result = await signup(signupData)
    
    setLoading(false)

    if (result.success) {
      if (result.pending) {
        setSuccessMsg(result.message || 'Account created! Please wait for an admin to approve your account.')
        setError('')
      } else {
        navigate('/home')
      }
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <div className="logo-section">
            <h1 className="organization-name">Alpha Kappa Psi</h1>
            <div className="greek-letters">ΑΚΨ</div>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the pledge portal to begin your journey</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {successMsg ? (
          <div className="success-message" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3>Account Created</h3>
            <p style={{ marginTop: '1rem', color: '#444' }}>{successMsg}</p>
            <p style={{ marginTop: '2rem' }}>
              <Link to="/login" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Return to Login
              </Link>
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pledgeClass">Pledge Class</label>
            <input
              type="text"
              id="pledgeClass"
              name="pledgeClass"
              value={formData.pledgeClass}
              onChange={handleChange}
              placeholder="e.g., Fall 2025"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the terms and conditions</span>
            </label>
          </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {!successMsg && (
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        )}
      </div>

      <div className="auth-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  )
}

export default Signup

