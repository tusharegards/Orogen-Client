import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { Box, Spinner, Center, Text } from '@chakra-ui/react'

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="teal.500" mb={4} />
          <Text fontSize="sm" color="gray.500">Verifying session...</Text>
        </Box>
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Center minH="60vh">
        <Box textAlign="center">
          <Spinner size="xl" color="purple.500" mb={4} />
          <Text fontSize="sm" color="gray.500">Verifying admin credentials...</Text>
        </Box>
      </Center>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!['admin', 'superadmin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
