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

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
)

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  // Real-time password validation helpers
  const isMinLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  const isPasswordValid = isMinLength && hasUpper && hasLower && hasNumber && hasSpecial

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isPasswordValid) {
      setError('Password must meet all complexity requirements listed below.')
      return
    }

    setLoading(true)
    const res = await signup(name, email, password)
    setLoading(false)

    if (res.success && res.requiresVerification) {
      navigate('/verify-otp', {
        state: {
          email: res.email || email,
          message: res.message,
        },
      })
    } else if (res.success) {
      navigate('/dashboard')
    } else {
      setError(res.message || 'Signup failed. Please try again.')
    }
  }

  return (
    <Box maxW="1160px" mx="auto" px={4} py={{ base: 12, md: 16 }}>
      <Box
        maxW="480px"
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
          New Account Registration
        </Text>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={2}
          fontFamily="heading"
          color="var(--text-main)"
        >
          Create Account
        </Heading>
        <Text textAlign="center" color="var(--text-soft)" fontSize="sm" mb={6}>
          Register your details to initiate Email OTP verification
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
                Full Name
              </Text>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
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
              <Box position="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  bg="rgba(8, 17, 15, 0.6)"
                  color="var(--text-main)"
                  borderColor="var(--surface-line)"
                  borderRadius="xl"
                  size="lg"
                  pr="3rem"
                  _focus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent)' }}
                  _placeholder={{ color: 'var(--text-muted)' }}
                />
                <Box
                  as="button"
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  position="absolute"
                  right="0.75rem"
                  top="50%"
                  transform="translateY(-50%)"
                  color="var(--text-soft)"
                  _hover={{ color: '#e8b978' }}
                  p={1.5}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  zIndex={2}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Box>
              </Box>

              {/* Password instructions under input box */}
              <Box
                mt={3}
                p={4}
                bg="rgba(8, 17, 15, 0.7)"
                borderRadius="xl"
                border="1px solid"
                borderColor="var(--surface-line)"
              >
                <Text fontSize="xs" color="var(--accent-soft)" fontWeight="600" mb={2}>
                  Password Requirements:
                </Text>
                <VStack align="start" spacing={1.5} fontSize="xs">
                  <Text color={isMinLength ? 'var(--accent-soft)' : 'var(--text-muted)'}>
                    {isMinLength ? '✓' : '•'} Minimum 8 characters
                  </Text>
                  <Text color={hasUpper ? 'var(--accent-soft)' : 'var(--text-muted)'}>
                    {hasUpper ? '✓' : '•'} At least 1 uppercase letter (A-Z)
                  </Text>
                  <Text color={hasLower ? 'var(--accent-soft)' : 'var(--text-muted)'}>
                    {hasLower ? '✓' : '•'} At least 1 lowercase letter (a-z)
                  </Text>
                  <Text color={hasNumber ? 'var(--accent-soft)' : 'var(--text-muted)'}>
                    {hasNumber ? '✓' : '•'} At least 1 numerical value (0-9)
                  </Text>
                  <Text color={hasSpecial ? 'var(--accent-soft)' : 'var(--text-muted)'}>
                    {hasSpecial ? '✓' : '•'} At least 1 special character (!@#$%^&*)
                  </Text>
                </VStack>
              </Box>
            </Box>

            <Button
              type="submit"
              loading={loading}
              size="lg"
              mt={3}
              width="full"
              borderRadius="full"
              bg="linear-gradient(135deg, #e8b978 0%, #c49450 100%)"
              color="#0b1512"
              fontWeight="700"
              boxShadow="0 4px 20px rgba(232, 185, 120, 0.25)"
              _hover={{
                transform: 'translateY(-2px)',
                bg: 'linear-gradient(135deg, #f5cc8a 0%, #d8a25c 100%)',
                boxShadow: '0 6px 24px rgba(232, 185, 120, 0.4)',
              }}
            >
              Create Account & Send OTP
            </Button>
          </VStack>
        </form>

        <Text textAlign="center" mt={6} fontSize="sm" color="var(--text-soft)">
          Already registered?{' '}
          <Text
            as={Link}
            to="/login"
            color="#e8b978"
            fontWeight="700"
            textDecoration="underline"
            _hover={{ color: '#f5cc8a' }}
          >
            Sign in here
          </Text>
        </Text>
      </Box>
    </Box>
  )
}

export default Signup
