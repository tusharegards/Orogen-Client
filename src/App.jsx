import React from 'react'
import { Route, Routes } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute } from './Components/auth/ProtectedRoute'

// Pages
import Home from './Pages/Home'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import VerifyOtp from './Pages/VerifyOtp'
import UserDashboard from './Pages/UserDashboard'
import AdminDashboard from './Pages/AdminDashboard'

import SiteShell from './Components/layout/SiteShell'

const App = () => {
  return (
    <AuthProvider>
      <SiteShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </SiteShell>
    </AuthProvider>
  )
}

export default App
