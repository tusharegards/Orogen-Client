import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Text, HStack, Badge, VStack } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { profileMenuStyles } from '../../styles/siteShellStyles'

const GearIcon = () => (
  <Box
    as="svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...profileMenuStyles.inlineIcon}
  >
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z" />
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 0 1 0 2.7a1.9 1.9 0 0 1-2.7 0l-.1-.1a1 1 0 0 0-1.1-.2a1 1 0 0 0-.6.9V20a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.7-.9a1 1 0 0 0-1 .2l-.2.1a1.9 1.9 0 0 1-2.7 0a1.9 1.9 0 0 1 0-2.7l.1-.1a1 1 0 0 0 .2-1.1a1 1 0 0 0-.9-.6H4a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.7a1 1 0 0 0-.2-1l-.1-.2a1.9 1.9 0 0 1 0-2.7a1.9 1.9 0 0 1 2.7 0l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 0 1 4 0v.2a1 1 0 0 0 .6.9a1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 0 1 2.7 0a1.9 1.9 0 0 1 0 2.7l-.1.2a1 1 0 0 0-.2 1a1 1 0 0 0 .9.7h.2a2 2 0 0 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
  </Box>
)

const ThemeProfileMenu = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false)
        setShowSettings(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  const isDark = (resolvedTheme ?? 'dark') !== 'light'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  const isAdminOrSuperAdmin = user && ['admin', 'superadmin'].includes(user.role)

  return (
    <Box ref={menuRef} {...profileMenuStyles.wrapper}>
      {/* Profile / Menu Trigger */}
      <Box
        as="button"
        type="button"
        aria-label="Open profile settings"
        onClick={() => setOpen((current) => !current)}
        {...profileMenuStyles.trigger}
      >
        <Box {...profileMenuStyles.avatarHead} />
        <Box {...profileMenuStyles.avatarBody} />
      </Box>

      {open ? (
        <Box {...profileMenuStyles.panel}>
          <VStack align="stretch" spacing={2.5} mb={3}>
            {user ? (
              <>
                <HStack justify="space-between">
                  <Text fontWeight="bold" fontSize="sm" color="#ffffff">{user.name}</Text>
                  <Badge bg="rgba(232, 185, 120, 0.2)" color="var(--accent-soft)" fontSize="xs" px={2.5} py={0.5} borderRadius="full" fontWeight="bold">
                    {user.role}
                  </Badge>
                </HStack>
                <Text fontSize="xs" color="var(--text-soft)" mb={1}>{user.email}</Text>
              </>
            ) : (
              <Box mb={1}>
                <Text {...profileMenuStyles.panelTitle}>Account & Navigation</Text>
                <Text {...profileMenuStyles.panelCopy}>
                  Access system portals and site settings.
                </Text>
              </Box>
            )}

            {/* Navigation links under profile icon */}
            <Button
              size="sm"
              bg="rgba(255, 255, 255, 0.08)"
              color="#ffffff"
              _hover={{ bg: 'rgba(255, 255, 255, 0.16)' }}
              borderRadius="xl"
              justifyContent="flex-start"
              fontWeight="600"
              onClick={() => { setOpen(false); navigate('/') }}
            >
              Home
            </Button>

            {user ? (
              isAdminOrSuperAdmin ? (
                <Button
                  size="sm"
                  bg="rgba(255, 255, 255, 0.16)"
                  color="#ffffff"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }}
                  borderRadius="xl"
                  justifyContent="flex-start"
                  fontWeight="700"
                  onClick={() => { setOpen(false); navigate('/admin') }}
                >
                  Admin Console
                </Button>
              ) : (
                <Button
                  size="sm"
                  bg="rgba(255, 255, 255, 0.16)"
                  color="#ffffff"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }}
                  borderRadius="xl"
                  justifyContent="flex-start"
                  fontWeight="700"
                  onClick={() => { setOpen(false); navigate('/dashboard') }}
                >
                  User Dashboard
                </Button>
              )
            ) : (
              <VStack spacing={2.5} align="stretch" width="full">
                <Button
                  size="sm"
                  bg="rgba(232, 185, 120, 0.12)"
                  color="#e8b978"
                  border="1px solid rgba(232, 185, 120, 0.3)"
                  _hover={{ bg: 'rgba(232, 185, 120, 0.22)', borderColor: '#e8b978' }}
                  width="full"
                  borderRadius="xl"
                  fontWeight="600"
                  onClick={() => { setOpen(false); navigate('/login') }}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  bg="linear-gradient(135deg, #e8b978 0%, #c49450 100%)"
                  color="#0b1512"
                  _hover={{ bg: 'linear-gradient(135deg, #f5cc8a 0%, #d8a25c 100%)', transform: 'translateY(-1px)' }}
                  width="full"
                  borderRadius="xl"
                  fontWeight="700"
                  onClick={() => { setOpen(false); navigate('/signup') }}
                >
                  Create Account
                </Button>
              </VStack>
            )}

            {user && (
              <Button
                size="sm"
                bg="rgba(255, 255, 255, 0.12)"
                color="#ffffff"
                _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
                borderRadius="xl"
                justifyContent="flex-start"
                fontWeight="600"
                mt={1}
                onClick={() => { setOpen(false); logout() }}
              >
                Sign Out
              </Button>
            )}
          </VStack>

          <Button
            type="button"
            onClick={() => setShowSettings((current) => !current)}
            {...profileMenuStyles.settingsButton}
          >
            <GearIcon />
            <Text as="span">Settings</Text>
          </Button>

          {showSettings ? (
            <Box {...profileMenuStyles.settingsPanel}>
              <Box>
                <Text {...profileMenuStyles.settingsTitle}>Dark mode</Text>
                <Text {...profileMenuStyles.settingsCopy}>
                  Keep the night climb on by default.
                </Text>
              </Box>

              <Box
                as="button"
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? 'Disable dark mode' : 'Enable dark mode'}
                aria-pressed={isDark}
                {...profileMenuStyles.switchTrack}
              >
                <Box
                  {...profileMenuStyles.switchThumb}
                  transform={isDark ? 'translateX(1.5rem)' : 'translateX(0)'}
                />
              </Box>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  )
}

export default ThemeProfileMenu
