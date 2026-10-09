import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('orogen_token') || null)
  const [loading, setLoading] = useState(true)

  // Verify stored token on initial app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('orogen_token')
      if (storedToken) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          const data = await res.json()
          if (data.success) {
            setUser(data.user)
            setToken(storedToken)
          } else {
            localStorage.removeItem('orogen_token')
            setToken(null)
            setUser(null)
          }
        } catch (err) {
          console.error('Failed to verify session:', err)
          localStorage.removeItem('orogen_token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('orogen_token', data.token)
        setToken(data.token)
        setUser(data.user)
      }
      return data
    } catch (err) {
      console.error('Login error:', err)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      return await res.json()
    } catch (err) {
      console.error('Signup error:', err)
      return { success: false, message: 'Network error. Please try again.' }
    }
  }

  // Verify OTP handler
  const verifyOtp = async (email, otp) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('orogen_token', data.token)
        setToken(data.token)
        setUser(data.user)
      }
      return data
    } catch (err) {
      console.error('Verify OTP error:', err)
      return { success: false, message: 'Network error during OTP verification.' }
    }
  }

  // Resend OTP handler
  const resendOtp = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      return await res.json()
    } catch (err) {
      console.error('Resend OTP error:', err)
      return { success: false, message: 'Network error while resending OTP.' }
    }
  }

  // Logout handler
  const logout = () => {
    localStorage.removeItem('orogen_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
