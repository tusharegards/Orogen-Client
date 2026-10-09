import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  VStack,
  HStack,
} from '@chakra-ui/react'

const VerifyOtp = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyOtp, resendOtp } = useAuth()

  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState(
    location.state?.message || 'We have sent a 6-digit OTP code to your email. Please check your inbox.'
  )
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    const res = await verifyOtp(email, otp)
    setLoading(false)

    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(res.message || 'Verification failed. Please check the OTP code sent to your email.')
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email address to resend the OTP code.')
      return
    }
    setError('')
    setResending(true)
    const res = await resendOtp(email)
    setResending(false)

    if (res.success) {
      setInfo(res.message || `A new 6-digit OTP code has been sent to ${email}.`)
    } else {
      setError(res.message || 'Failed to resend OTP code.')
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
          Two-Factor Security
        </Text>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={2}
          fontFamily="heading"
          color="var(--text-main)"
        >
          Verify Your Email
        </Heading>
        <Text textAlign="center" color="var(--text-soft)" fontSize="sm" mb={6}>
          Enter the 6-digit verification code sent to your email
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

        {info && !error && (
          <Box
            p={3}
            mb={5}
            borderRadius="xl"
            bg="rgba(232, 185, 120, 0.12)"
            border="1px solid rgba(232, 185, 120, 0.25)"
            color="var(--accent-soft)"
            fontSize="sm"
            textAlign="center"
            fontWeight="500"
          >
            {info}
          </Box>
        )}

        <form onSubmit={handleVerify}>
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
                6-Digit OTP Code
              </Text>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="••••••"
                required
                textAlign="center"
                fontSize="2xl"
                letterSpacing="0.3em"
                fontWeight="bold"
                bg="rgba(8, 17, 15, 0.6)"
                color="var(--accent-soft)"
                borderColor="var(--accent)"
                borderRadius="xl"
                size="lg"
                _focus={{ borderColor: 'var(--accent-soft)', boxShadow: '0 0 0 1px var(--accent-soft)' }}
              />
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
              Verify & Activate Account
            </Button>
          </VStack>
        </form>

        <HStack justify="space-between" mt={6} pt={4} borderTop="1px solid" borderColor="var(--surface-line)">
          <Button
            size="sm"
            variant="ghost"
            color="#ffffff"
            _hover={{ bg: 'var(--secondary-surface-hover)' }}
            loading={resending}
            onClick={handleResend}
          >
            Resend OTP
          </Button>
          <Text as={Link} to="/login" fontSize="sm" color="var(--text-soft)" _hover={{ color: 'var(--text-main)' }}>
            Back to Login
          </Text>
        </HStack>
      </Box>
    </Box>
  )
}

export default VerifyOtp
