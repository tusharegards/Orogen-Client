import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  Grid,
  GridItem,
  VStack,
  HStack,
  Spinner,
  Input,
} from '@chakra-ui/react'

const UserDashboard = () => {
  const { user, token, logout } = useAuth()
  const isAdminOrSuperAdmin = user && ['admin', 'superadmin'].includes(user.role)

  const [profileData, setProfileData] = useState(null)
  const [usersList, setUsersList] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchDashboardData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      
      // Fetch complete user profile with RBAC groups, project & account linkage
      const meRes = await fetch('/api/auth/me', { headers })
      const meData = await meRes.json()
      if (meData.success) {
        setProfileData(meData.user)
      }

      if (isAdminOrSuperAdmin) {
        const usersRes = await fetch('/api/auth/admin/users', { headers })
        const usersData = await usersRes.json()
        if (usersData.success) {
          setUsersList(usersData.users)
        }
      }
    } catch (err) {
      console.error('Failed to fetch user dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [token, isAdminOrSuperAdmin])

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentUser = profileData || user

  return (
    <Box maxW="1100px" mx="auto" p={{ base: 4, md: 6 }} pt={{ base: 12, md: 16 }}>
      {/* Admin / Super Admin Shortcut Banner */}
      {isAdminOrSuperAdmin && (
        <Box
          p={{ base: 4, md: 6 }}
          mb={8}
          borderRadius="2xl"
          bg="rgba(18, 37, 32, 0.95)"
          border="1px solid"
          borderColor="rgba(232, 185, 120, 0.3)"
          boxShadow="var(--shadow)"
        >
          <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
            <Box>
              <Text fontWeight="700" color="var(--accent-soft)" fontSize="sm" fontFamily="heading">
                Administrator Privilege Detected ({currentUser?.role})
              </Text>
              <Text fontSize="xs" color="var(--text-soft)">
                Full Accounts, Projects, User Classifications & RBAC Group Consoles are available.
              </Text>
            </Box>

            <Button
              as={Link}
              to="/admin"
              size="sm"
              bg="rgba(255, 255, 255, 0.16)"
              color="#ffffff"
              _hover={{ transform: 'translateY(-1px)', bg: 'rgba(255, 255, 255, 0.24)' }}
              fontWeight="700"
              px={5}
              py={2}
              borderRadius="full"
              boxShadow="var(--shadow-soft)"
            >
              Open Admin & RBAC Console
            </Button>
          </HStack>
        </Box>
      )}

      {/* Header Banner */}
      <Box
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        bg="var(--surface-strong)"
        backdropFilter="blur(16px)"
        boxShadow="var(--shadow)"
        mb={8}
        border="1px solid"
        borderColor="var(--surface-line)"
      >
        <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
          <HStack spacing={4}>
            <Box
              w="56px"
              h="56px"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.16)"
              color="#ffffff"
              display="grid"
              placeItems="center"
              fontWeight="bold"
              fontSize="xl"
              boxShadow="var(--shadow-soft)"
            >
              {currentUser?.name?.[0]?.toUpperCase() || 'U'}
            </Box>
            <Box>
              <HStack spacing={2} mb={1} flexWrap="wrap">
                <Heading size="lg" color="var(--text-main)" fontFamily="heading">
                  Welcome back, {currentUser?.name}!
                </Heading>
                <Badge
                  bg="rgba(255, 255, 255, 0.1)"
                  color="#ffffff"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {currentUser?.role}
                </Badge>
                <Badge
                  bg="rgba(255, 255, 255, 0.1)"
                  color="#ffffff"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                >
                  {currentUser?.user_type === 'employee' ? 'Employee' : `Contact (${currentUser?.contact_sub_type || 'lead'})`}
                </Badge>
              </HStack>
              <Text color="var(--text-soft)" fontSize="sm">
                {currentUser?.email} • Verified Account
              </Text>
            </Box>
          </HStack>

          {/* Sign Out Button */}
          <Button
            size="sm"
            bg="rgba(255, 255, 255, 0.12)"
            color="#ffffff"
            _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
            fontWeight="700"
            px={5}
            py={2}
            borderRadius="full"
            boxShadow="var(--shadow-soft)"
            onClick={logout}
          >
            Sign Out
          </Button>
        </HStack>
      </Box>

      {/* Main Grid Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={8}>
        <GridItem
          bg="var(--surface-card)"
          backdropFilter="blur(14px)"
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="var(--surface-line)"
          boxShadow="var(--shadow)"
        >
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            Account Status
          </Text>
          <Text color="var(--accent-soft)" fontSize="3xl" fontFamily="heading" fontWeight="bold" my={1}>
            Active
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">Verified via PostgreSQL Auth</Text>
        </GridItem>

        <GridItem
          bg="var(--surface-card)"
          backdropFilter="blur(14px)"
          p={6}
          borderRadius="2xl"
          border="1px solid"
          borderColor="var(--surface-line)"
          boxShadow="var(--shadow)"
        >
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            Classification & Linkage
          </Text>
          <Text color="var(--accent-soft)" fontSize="2xl" fontFamily="heading" fontWeight="bold" my={1}>
            {currentUser?.user_type === 'employee'
              ? `Employee (${currentUser?.project_name || 'Unassigned Project'})`
              : `Contact (${currentUser?.contact_sub_type?.toUpperCase() || 'LEAD'} @ ${currentUser?.account_name || 'Unassigned Account'})`}
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">
            {currentUser?.user_type === 'employee' ? 'Points directly to Projects table' : 'Points to Accounts table -> Projects'}
          </Text>
        </GridItem>
      </Grid>

      {/* Account Info Card */}
      <Box
        bg="var(--surface-card)"
        backdropFilter="blur(14px)"
        p={6}
        borderRadius="2xl"
        border="1px solid"
        borderColor="var(--surface-line)"
        boxShadow="var(--shadow)"
      >
        <Heading size="md" mb={4} color="var(--text-main)" fontFamily="heading">
          User Profile & RBAC Membership
        </Heading>
        <VStack align="stretch" spacing={3} color="var(--text-soft)" fontSize="sm">
          <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
            <Text fontWeight="medium" color="var(--text-muted)">Full Name</Text>
            <Text fontWeight="600" color="var(--text-main)">{currentUser?.name}</Text>
          </HStack>
          <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
            <Text fontWeight="medium" color="var(--text-muted)">Email Address</Text>
            <Text fontWeight="600" color="var(--text-main)">{currentUser?.email}</Text>
          </HStack>
          <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
            <Text fontWeight="medium" color="var(--text-muted)">User Type</Text>
            <Badge bg={currentUser?.user_type === 'employee' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(168, 85, 247, 0.2)'} color={currentUser?.user_type === 'employee' ? '#93c5fd' : '#c084fc'} px={2.5} py={0.5} borderRadius="full">
              {currentUser?.user_type === 'employee' ? 'Employee' : `Contact (${currentUser?.contact_sub_type})`}
            </Badge>
          </HStack>
          {currentUser?.user_type === 'employee' ? (
            <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
              <Text fontWeight="medium" color="var(--text-muted)">Assigned Project</Text>
              <Text fontWeight="600" color="var(--accent-soft)">{currentUser?.project_name || 'None'}</Text>
            </HStack>
          ) : (
            <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
              <Text fontWeight="medium" color="var(--text-muted)">Linked Client Account</Text>
              <Text fontWeight="600" color="var(--accent-soft)">{currentUser?.account_name || 'None'}</Text>
            </HStack>
          )}

          {/* ASSIGNED GROUPS */}
          <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
            <Text fontWeight="medium" color="var(--text-muted)">Assigned Groups (AWS/ServiceNow Model)</Text>
            <HStack spacing={1} flexWrap="wrap">
              {currentUser?.groups && currentUser.groups.length > 0 ? (
                currentUser.groups.map((g) => (
                  <Badge key={g.id} bg="rgba(232, 185, 120, 0.18)" color="var(--accent-soft)" px={2.5} py={0.5} borderRadius="full">
                    {g.name}
                  </Badge>
                ))
              ) : (
                <Text color="var(--text-muted)">No groups assigned</Text>
              )}
            </HStack>
          </HStack>

          {/* EFFECTIVE INHERITED ROLES */}
          <HStack justify="space-between" p={3} bg="rgba(255,255,255,0.02)" borderRadius="xl" border="1px solid var(--surface-line)">
            <Text fontWeight="medium" color="var(--text-muted)">Effective Inherited Roles</Text>
            <HStack spacing={1} flexWrap="wrap">
              {currentUser?.effectiveRoles && currentUser.effectiveRoles.length > 0 ? (
                currentUser.effectiveRoles.map((r, idx) => (
                  <Badge key={idx} bg="rgba(59, 130, 246, 0.2)" color="#93c5fd" px={2.5} py={0.5} borderRadius="full">
                    {r}
                  </Badge>
                ))
              ) : (
                <Badge bg="rgba(232, 185, 120, 0.18)" color="var(--accent-soft)" px={2.5} py={0.5} borderRadius="full">
                  {currentUser?.role}
                </Badge>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default UserDashboard
