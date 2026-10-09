import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login(email, password)
    setLoading(false)

    if (res.success) {
      if (['admin', 'superadmin'].includes(res.user.role)) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else if (res.requiresVerification) {
      navigate('/verify-otp', {
        state: {
          email: res.email || email,
          message: res.message,
        },
      })
    } else {
      setError(res.message || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <Box maxW="1160px" mx="auto" px={4} py={{ base: 12, md: 16 }}>
      <Box
        maxW="460px"
        mx="auto"
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor="var(--surface-line)"
        bg="var(--surface-strong)"
        backdropFilter="blur(16px)"
        boxShadow="var(--shadow)"
        color="var(--text-main)"
      >
        <Text
          textAlign="center"
          fontSize="xs"
          letterSpacing="0.14em"
          textTransform="uppercase"
          color="var(--accent-soft)"
          mb={2}
          fontWeight="600"
        >
          Secure Authentication
        </Text>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={2}
          fontFamily="heading"
          color="var(--text-main)"
        >
          Welcome Back
        </Heading>
        <Text textAlign="center" color="var(--text-soft)" fontSize="sm" mb={6}>
          Sign in with your credentials to access your portal
        </Text>

        {error && (
          <Box
            p={3}
            mb={5}
            borderRadius="xl"
            bg="rgba(185, 28, 28, 0.2)"
            border="1px solid rgba(239, 68, 68, 0.4)"
            color="#fca5a5"
            fontSize="sm"
            textAlign="center"
            fontWeight="500"
          >
            {error}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text
                fontSize="xs"
                fontWeight="600"
                color="var(--text-soft)"
                mb={1.5}
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Email Address
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                bg="rgba(8, 17, 15, 0.6)"
                color="var(--text-main)"
                borderColor="var(--surface-line)"
                borderRadius="xl"
                size="lg"
                _focus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent)' }}
                _placeholder={{ color: 'var(--text-muted)' }}
              />
            </Box>

            <Box>
              <Text
                fontSize="xs"
                fontWeight="600"
                color="var(--text-soft)"
                mb={1.5}
                letterSpacing="0.05em"
                textTransform="uppercase"
              >
                Password
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                bg="rgba(8, 17, 15, 0.6)"
                color="var(--text-main)"
                borderColor="var(--surface-line)"
                borderRadius="xl"
                size="lg"
                _focus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent)' }}
                _placeholder={{ color: 'var(--text-muted)' }}
              />
            </Box>

            <Button
              type="submit"
              loading={loading}
              size="lg"
              mt={3}
              width="full"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.16)"
              color="#ffffff"
              fontWeight="700"
              boxShadow="var(--shadow-soft)"
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'rgba(255, 255, 255, 0.24)',
              }}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={6} fontSize="sm" color="var(--text-soft)">
          Don't have an account?{' '}
          <Text
            as={Link}
            to="/signup"
            color="var(--accent-soft)"
            fontWeight="600"
            _hover={{ textDecoration: 'underline' }}
          >
            Sign up now
          </Text>
        </Text>
      </Box>
    </Box>
  )
}

export default Login
