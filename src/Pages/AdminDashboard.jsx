import React, { useEffect, useState } from 'react'
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

const AdminDashboard = () => {
  const { user, token, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [usersList, setUsersList] = useState([])
  const [accountsList, setAccountsList] = useState([])
  const [projectsList, setProjectsList] = useState([])
  const [groupsList, setGroupsList] = useState([])
  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)

  // Navigation Tab State: 'users' | 'accounts' | 'projects' | 'groups'
  const [activeTab, setActiveTab] = useState('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')

  // ---------------- USER MODAL STATE ----------------
  const [showUserModal, setShowUserModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'internal_user',
    user_type: 'employee',
    contact_sub_type: 'lead',
    account_id: '',
    project_id: '',
    is_verified: true,
    group_ids: [],
  })

  // ---------------- ACCOUNT MODAL STATE ----------------
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    industry: '',
    status: 'active',
  })

  // ---------------- PROJECT MODAL STATE ----------------
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectFormData, setProjectFormData] = useState({
    name: '',
    description: '',
    account_id: '',
    status: 'active',
  })

  // ---------------- GROUP MODAL STATE ----------------
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    role_ids: [],
  })

  const [formLoading, setFormLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Fetch all Admin Data
  const fetchAllData = async () => {
    if (!token) return
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const sRes = await fetch('/api/auth/admin/stats', { headers })
      const sData = await sRes.json()
      if (sData.success) setStats(sData.stats)

      const uRes = await fetch('/api/auth/admin/users', { headers })
      const uData = await uRes.json()
      if (uData.success) setUsersList(uData.users)

      const aRes = await fetch('/api/accounts', { headers })
      const aData = await aRes.json()
      if (aData.success) setAccountsList(aData.accounts)

      const pRes = await fetch('/api/projects', { headers })
      const pData = await pRes.json()
      if (pData.success) setProjectsList(pData.projects)

      const gRes = await fetch('/api/rbac/groups', { headers })
      const gData = await gRes.json()
      if (gData.success) setGroupsList(gData.groups)

      const rRes = await fetch('/api/rbac/roles', { headers })
      const rData = await rRes.json()
      if (rData.success) setRolesList(rData.roles)
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [token])

  // ---------------- USER HANDLERS ----------------
  const openAddUserModal = () => {
    setEditingUser(null)
    setUserFormData({
      name: '',
      email: '',
      password: '',
      role: 'internal_user',
      user_type: 'employee',
      contact_sub_type: 'lead',
      account_id: '',
      project_id: '',
      is_verified: true,
      group_ids: [],
    })
    setShowUserModal(true)
    setMessage('')
  }

  const openEditUserModal = (u) => {
    if (u.email.toLowerCase() === 'harshty261@gmail.com' || u.role === 'superadmin') {
      setMessage('Action forbidden. Super Admin account details cannot be modified.')
      return
    }
    setEditingUser(u)
    setUserFormData({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      user_type: u.user_type || 'employee',
      contact_sub_type: u.contact_sub_type || 'lead',
      account_id: u.account_id ? String(u.account_id) : '',
      project_id: u.project_id ? String(u.project_id) : '',
      is_verified: u.is_verified,
      group_ids: u.group_ids || [],
    })
    setShowUserModal(true)
    setMessage('')
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage('')

    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
      const url = editingUser ? `/api/auth/admin/users/${editingUser.id}` : '/api/auth/admin/users'
      const method = editingUser ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers, body: JSON.stringify(userFormData) })
      const data = await res.json()

      if (data.success) {
        setMessage(data.message)
        setShowUserModal(false)
        fetchAllData()
      } else {
        setMessage(data.message || 'Failed to save user.')
      }
    } catch (err) {
      setMessage('Failed to connect to server.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteUser = async (u) => {
    if (u.email.toLowerCase() === 'harshty261@gmail.com' || u.role === 'superadmin') {
      setMessage('Action forbidden. Super Admin account cannot be deleted.')
      return
    }
    if (!window.confirm(`Delete user account "${u.name}" (${u.email})?`)) return

    setActionLoadingId(`user_${u.id}`)
    try {
      const res = await fetch(`/api/auth/admin/users/${u.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        fetchAllData()
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Failed to delete user.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // ---------------- ACCOUNT HANDLERS ----------------
  const openAddAccountModal = () => {
    setEditingAccount(null)
    setAccountFormData({ name: '', industry: '', status: 'active' })
    setShowAccountModal(true)
    setMessage('')
  }

  const openEditAccountModal = (acc) => {
    setEditingAccount(acc)
    setAccountFormData({ name: acc.name, industry: acc.industry || '', status: acc.status || 'active' })
    setShowAccountModal(true)
    setMessage('')
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage('')

    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      const url = editingAccount ? `/api/accounts/${editingAccount.id}` : '/api/accounts'
      const method = editingAccount ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers, body: JSON.stringify(accountFormData) })
      const data = await res.json()

      if (data.success) {
        setMessage(data.message)
        setShowAccountModal(false)
        fetchAllData()
      } else {
        setMessage(data.message || 'Failed to save account.')
      }
    } catch (err) {
      setMessage('Server error while saving account.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteAccount = async (acc) => {
    if (!window.confirm(`Delete account "${acc.name}"?`)) return
    setActionLoadingId(`acc_${acc.id}`)
    try {
      const res = await fetch(`/api/accounts/${acc.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        fetchAllData()
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Failed to delete account.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // ---------------- PROJECT HANDLERS ----------------
  const openAddProjectModal = () => {
    setEditingProject(null)
    setProjectFormData({ name: '', description: '', account_id: '', status: 'active' })
    setShowProjectModal(true)
    setMessage('')
  }

  const openEditProjectModal = (proj) => {
    setEditingProject(proj)
    setProjectFormData({
      name: proj.name,
      description: proj.description || '',
      account_id: proj.account_id ? String(proj.account_id) : '',
      status: proj.status || 'active',
    })
    setShowProjectModal(true)
    setMessage('')
  }

  const handleProjectSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage('')

    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers, body: JSON.stringify(projectFormData) })
      const data = await res.json()

      if (data.success) {
        setMessage(data.message)
        setShowProjectModal(false)
        fetchAllData()
      } else {
        setMessage(data.message || 'Failed to save project.')
      }
    } catch (err) {
      setMessage('Server error while saving project.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProject = async (proj) => {
    if (!window.confirm(`Delete project "${proj.name}"?`)) return
    setActionLoadingId(`proj_${proj.id}`)
    try {
      const res = await fetch(`/api/projects/${proj.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        fetchAllData()
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Failed to delete project.')
    } finally {
      setActionLoadingId(null)
    }
  }

  // ---------------- GROUP / RBAC HANDLERS ----------------
  const openAddGroupModal = () => {
    setEditingGroup(null)
    setGroupFormData({ name: '', description: '', role_ids: [] })
    setShowGroupModal(true)
    setMessage('')
  }

  const openEditGroupModal = (g) => {
    const assignedRoleNames = g.assigned_roles || []
    const roleIds = rolesList.filter((r) => assignedRoleNames.includes(r.name)).map((r) => r.id)

    setEditingGroup(g)
    setGroupFormData({ name: g.name, description: g.description || '', role_ids: roleIds })
    setShowGroupModal(true)
    setMessage('')
  }

  const handleGroupSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setMessage('')

    try {
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      const url = editingGroup ? `/api/rbac/groups/${editingGroup.id}` : '/api/rbac/groups'
      const method = editingGroup ? 'PUT' : 'POST'

      const res = await fetch(url, { method, headers, body: JSON.stringify(groupFormData) })
      const data = await res.json()

      if (data.success) {
        setMessage(data.message)
        setShowGroupModal(false)
        fetchAllData()
      } else {
        setMessage(data.message || 'Failed to save group.')
      }
    } catch (err) {
      setMessage('Server error while saving group.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteGroup = async (g) => {
    if (g.name === 'Super Administrators') {
      setMessage('The Super Administrators group cannot be deleted.')
      return
    }
    if (!window.confirm(`Delete group "${g.name}"?`)) return
    setActionLoadingId(`group_${g.id}`)
    try {
      const res = await fetch(`/api/rbac/groups/${g.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMessage(data.message)
        fetchAllData()
      } else {
        setMessage(data.message)
      }
    } catch (err) {
      setMessage('Failed to delete group.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.account_name && u.account_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.project_name && u.project_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredAccounts = accountsList.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.industry && a.industry.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredProjects = projectsList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.account_name && p.account_name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredGroups = groupsList.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <Box maxW="1240px" mx="auto" p={{ base: 4, md: 6 }} pt={{ base: 12, md: 16 }} color="var(--text-main)">
      {/* Header Banner */}
      <Box
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        bg="var(--surface-strong)"
        backdropFilter="blur(16px)"
        mb={8}
      >
        <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
          <Box>
            <HStack spacing={2} mb={1}>
              <Heading size="lg" color="#ffffff" fontFamily="heading">
                Admin Console: {user?.name}
              </Heading>
              <Badge
                bg={user?.role === 'superadmin' ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)' : 'rgba(232, 185, 120, 0.2)'}
                color="#ffffff"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="700"
              >
                {user?.role === 'superadmin' ? 'Super Admin (Immutable)' : user?.role || 'Administrator'}
              </Badge>
            </HStack>
            <Text color="var(--text-soft)" fontSize="sm">
              {user?.email} • Group-Based Access Control
            </Text>
          </Box>

          <HStack spacing={3}>
            <Button
              size="sm"
              bg="rgba(255, 255, 255, 0.16)"
              color="#ffffff"
              _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }}
              borderRadius="full"
              px={4}
              onClick={fetchAllData}
              loading={loading}
              fontWeight="700"
            >
              Refresh Data
            </Button>

            <Button
              bg="rgba(255, 255, 255, 0.12)"
              color="#ffffff"
              _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }}
              size="sm"
              fontWeight="700"
              px={5}
              py={2}
              borderRadius="full"
              onClick={logout}
            >
              Sign Out
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Admin Metrics Grid */}
      <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={5} mb={8}>
        <GridItem bg="var(--surface-card)" backdropFilter="blur(14px)" p={5} borderRadius="2xl">
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            Total Users
          </Text>
          <Text color="#ffffff" fontSize="3xl" fontFamily="heading" fontWeight="bold" my={1}>
            {stats?.totalUsers ?? '...'}
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">Employees: {stats?.employees ?? 0} | Contacts: {stats?.contacts ?? 0}</Text>
        </GridItem>

        <GridItem bg="var(--surface-card)" backdropFilter="blur(14px)" p={5} borderRadius="2xl">
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            Accounts
          </Text>
          <Text color="#ffffff" fontSize="3xl" fontFamily="heading" fontWeight="bold" my={1}>
            {stats?.accounts ?? '...'}
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">Client & Partner Organizations</Text>
        </GridItem>

        <GridItem bg="var(--surface-card)" backdropFilter="blur(14px)" p={5} borderRadius="2xl">
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            Projects
          </Text>
          <Text color="#ffffff" fontSize="3xl" fontFamily="heading" fontWeight="bold" my={1}>
            {stats?.projects ?? '...'}
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">Client & Internal Workspaces</Text>
        </GridItem>

        <GridItem bg="var(--surface-card)" backdropFilter="blur(14px)" p={5} borderRadius="2xl">
          <Text color="var(--text-muted)" fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="0.08em">
            RBAC Groups
          </Text>
          <Text color="#ffffff" fontSize="3xl" fontFamily="heading" fontWeight="bold" my={1}>
            {stats?.groups ?? '...'}
          </Text>
          <Text color="var(--text-soft)" fontSize="xs">Role-Group Assignments</Text>
        </GridItem>
      </Grid>

      {message && (
        <Box p={3.5} mb={6} borderRadius="xl" bg="rgba(255, 255, 255, 0.1)" color="#ffffff" fontSize="sm" textAlign="center" fontWeight="600">
          {message}
        </Box>
      )}

      {/* Navigation Tabs - Neutral monochrome glass */}
      <HStack spacing={3} mb={6} pb={4} overflowX="auto">
        <Button
          size="sm"
          borderRadius="full"
          px={5}
          bg={activeTab === 'users' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
          color="#ffffff"
          fontWeight="700"
          onClick={() => { setActiveTab('users'); setSearchQuery('') }}
        >
          Users Directory
        </Button>
        <Button
          size="sm"
          borderRadius="full"
          px={5}
          bg={activeTab === 'accounts' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
          color="#ffffff"
          fontWeight="700"
          onClick={() => { setActiveTab('accounts'); setSearchQuery('') }}
        >
          Accounts ({accountsList.length})
        </Button>
        <Button
          size="sm"
          borderRadius="full"
          px={5}
          bg={activeTab === 'projects' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
          color="#ffffff"
          fontWeight="700"
          onClick={() => { setActiveTab('projects'); setSearchQuery('') }}
        >
          Projects ({projectsList.length})
        </Button>
        <Button
          size="sm"
          borderRadius="full"
          px={5}
          bg={activeTab === 'groups' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
          color="#ffffff"
          fontWeight="700"
          onClick={() => { setActiveTab('groups'); setSearchQuery('') }}
        >
          RBAC Groups ({groupsList.length})
        </Button>
      </HStack>

      {/* ========================================================= */}
      {/* TAB 1: USERS DIRECTORY */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <Box bg="var(--surface-strong)" backdropFilter="blur(16px)" p={6} borderRadius="2xl">
          <HStack justify="space-between" mb={6} flexWrap="wrap" spacing={4}>
            <Box>
              <Heading size="md" color="#ffffff" fontFamily="heading">
                User Classification & Directory Console
              </Heading>
              <Text fontSize="xs" color="var(--text-soft)" mt={1}>
                Classify users as <strong>Employee</strong> (linked to Projects) or <strong>Contact</strong> (Prospect/Lead/Customer/Churned linked to Accounts).
              </Text>
            </Box>

            <HStack spacing={3}>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                w="220px"
                bg="rgba(8, 17, 15, 0.6)"
                color="#ffffff"
                borderRadius="xl"
              />
              <Button
                size="sm"
                bg="rgba(255, 255, 255, 0.16)"
                color="#ffffff"
                _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }}
                fontWeight="700"
                borderRadius="full"
                px={4}
                onClick={openAddUserModal}
              >
                Create User
              </Button>
            </HStack>
          </HStack>

          {/* USER MODAL */}
          {showUserModal && (
            <Box mb={6} p={5} borderRadius="2xl" bg="rgba(8, 17, 15, 0.95)">
              <HStack justify="space-between" mb={4}>
                <Heading size="sm" color="#ffffff" fontFamily="heading">
                  {editingUser ? `Edit User: ${editingUser.name}` : 'Create New User Account'}
                </Heading>
                <Button size="xs" variant="ghost" color="#ffffff" onClick={() => setShowUserModal(false)}>
                  Close
                </Button>
              </HStack>

              <form onSubmit={handleUserSubmit}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Full Name</Text>
                    <Input
                      value={userFormData.name}
                      onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Email Address</Text>
                    <Input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                      placeholder="user@example.com"
                      required
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">
                      Password {editingUser && '(Leave blank to keep unchanged)'}
                    </Text>
                    <Input
                      type="password"
                      value={userFormData.password}
                      onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                      placeholder={editingUser ? '••••••••' : 'Password'}
                      required={!editingUser}
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  {/* USER TYPE: EMPLOYEE vs CONTACT */}
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">User Classification Type</Text>
                    <HStack spacing={2} mt={1}>
                      <Button
                        type="button"
                        size="sm"
                        flex={1}
                        borderRadius="full"
                        bg={userFormData.user_type === 'employee' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
                        color="#ffffff"
                        onClick={() => setUserFormData({ ...userFormData, user_type: 'employee' })}
                      >
                        Employee
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        flex={1}
                        borderRadius="full"
                        bg={userFormData.user_type === 'contact' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)'}
                        color="#ffffff"
                        onClick={() => setUserFormData({ ...userFormData, user_type: 'contact' })}
                      >
                        Contact
                      </Button>
                    </HStack>
                  </Box>

                  {/* DIRECT ROLE */}
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Direct Role Assignment</Text>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      {rolesList.map((r) => (
                        <option key={r.id} value={r.name}>{r.name} ({r.description})</option>
                      ))}
                    </select>
                  </Box>

                  {/* CONDITIONAL SUB-FIELDS */}
                  {userFormData.user_type === 'employee' ? (
                    <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                      <Text fontSize="xs" color="#ffffff" mb={1} fontWeight="600">Assigned Project (Employee linkage)</Text>
                      <select
                        value={userFormData.project_id}
                        onChange={(e) => setUserFormData({ ...userFormData, project_id: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        <option value="">-- No Direct Project Assigned --</option>
                        {projectsList.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} {p.account_name ? `(${p.account_name})` : ''}</option>
                        ))}
                      </select>
                    </Box>
                  ) : (
                    <>
                      <Box>
                        <Text fontSize="xs" color="#ffffff" mb={1} fontWeight="600">Contact Sub-Type</Text>
                        <select
                          value={userFormData.contact_sub_type}
                          onChange={(e) => setUserFormData({ ...userFormData, contact_sub_type: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          <option value="prospect">Prospect</option>
                          <option value="lead">Lead</option>
                          <option value="customer">Customer</option>
                          <option value="churned">Churned</option>
                        </select>
                      </Box>

                      <Box>
                        <Text fontSize="xs" color="#ffffff" mb={1} fontWeight="600">Linked Client Account</Text>
                        <select
                          value={userFormData.account_id}
                          onChange={(e) => setUserFormData({ ...userFormData, account_id: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          <option value="">-- No Account Linked --</option>
                          {accountsList.map((a) => (
                            <option key={a.id} value={a.id}>{a.name} ({a.industry || 'General'})</option>
                          ))}
                        </select>
                      </Box>
                    </>
                  )}

                  {/* GROUP ASSIGNMENTS */}
                  <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1.5} fontWeight="600">Assigned RBAC Groups (Inherits Group Roles)</Text>
                    <HStack flexWrap="wrap" gap={2}>
                      {groupsList.map((g) => {
                        const isAssigned = userFormData.group_ids.includes(g.id)
                        return (
                          <Button
                            key={g.id}
                            type="button"
                            size="xs"
                            borderRadius="full"
                            bg={isAssigned ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.06)'}
                            color="#ffffff"
                            onClick={() => {
                              const newGroupIds = isAssigned
                                ? userFormData.group_ids.filter((id) => id !== g.id)
                                : [...userFormData.group_ids, g.id]
                              setUserFormData({ ...userFormData, group_ids: newGroupIds })
                            }}
                          >
                            {g.name}
                          </Button>
                        )
                      })}
                    </HStack>
                  </Box>
                </Grid>

                <HStack justify="flex-end" spacing={3}>
                  <Button size="sm" variant="ghost" color="#ffffff" onClick={() => setShowUserModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} type="submit" loading={formLoading} borderRadius="full" fontWeight="700">
                    {editingUser ? 'Save User Changes' : 'Create User'}
                  </Button>
                </HStack>
              </form>
            </Box>
          )}

          {/* USER TABLE LIST */}
          <VStack spacing={3} align="stretch">
            {filteredUsers.map((u) => {
              const isSuperAdmin = u.email.toLowerCase() === 'harshty261@gmail.com' || u.role === 'superadmin'

              return (
                <HStack
                  key={u.id}
                  p={4}
                  borderRadius="xl"
                  bg="rgba(8, 17, 15, 0.6)"
                  justify="space-between"
                  flexWrap="wrap"
                  spacing={4}
                >
                  <HStack spacing={4}>
                    <Text color="var(--text-muted)" fontFamily="mono" fontSize="xs">#{u.id}</Text>
                    <Box>
                      <HStack spacing={2} flexWrap="wrap">
                        <Text fontWeight="600" color="#ffffff">{u.name}</Text>

                        {/* User Type Badge */}
                        <Badge bg={u.user_type === 'employee' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'} color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                          {u.user_type === 'employee' ? 'Employee' : `Contact (${u.contact_sub_type || 'lead'})`}
                        </Badge>

                        {/* Role Badge */}
                        <Badge bg={isSuperAdmin ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)' : 'rgba(232, 185, 120, 0.25)'} color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full" fontWeight="700">
                          {isSuperAdmin ? 'Super Admin' : u.role}
                        </Badge>
                      </HStack>

                      <Text fontSize="xs" color="var(--text-soft)" mt={0.5}>
                        {u.email}
                        {u.project_name ? ` • Project: ${u.project_name}` : ''}
                        {u.account_name ? ` • Account: ${u.account_name}` : ''}
                      </Text>

                      {/* Assigned Groups */}
                      {u.group_names && u.group_names.length > 0 && (
                        <HStack spacing={1} mt={1.5} flexWrap="wrap">
                          <Text fontSize="xs" color="var(--text-muted)">Groups:</Text>
                          {u.group_names.map((gn, idx) => (
                            <Badge key={idx} bg="rgba(255, 255, 255, 0.1)" color="#ffffff" fontSize="xs" px={2} py={0.2} borderRadius="full">
                              {gn}
                            </Badge>
                          ))}
                        </HStack>
                      )}
                    </Box>
                  </HStack>

                  <HStack spacing={2}>
                    {isSuperAdmin ? (
                      <Badge bg="rgba(232, 185, 120, 0.2)" color="#ffffff" px={3} py={1} borderRadius="full">
                        Super Admin (Protected)
                      </Badge>
                    ) : (
                      <>
                        <Button size="xs" bg="rgba(255, 255, 255, 0.12)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }} borderRadius="full" onClick={() => openEditUserModal(u)}>
                          Edit
                        </Button>
                        <Button size="xs" bg="rgba(185, 28, 28, 0.9)" color="#ffffff" _hover={{ bg: 'rgba(220, 38, 38, 1)' }} borderRadius="full" loading={actionLoadingId === `user_${u.id}`} onClick={() => handleDeleteUser(u)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </HStack>
                </HStack>
              )
            })}
          </VStack>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ACCOUNTS TABLE */}
      {/* ========================================================= */}
      {activeTab === 'accounts' && (
        <Box bg="var(--surface-strong)" backdropFilter="blur(16px)" p={6} borderRadius="2xl">
          <HStack justify="space-between" mb={6} flexWrap="wrap" spacing={4}>
            <Box>
              <Heading size="md" color="#ffffff" fontFamily="heading">
                Client & Organization Accounts Table
              </Heading>
              <Text fontSize="xs" color="var(--text-soft)" mt={1}>
                Accounts point to Projects. Contact type users (Prospect/Lead/Customer/Churned) belong to Accounts.
              </Text>
            </Box>

            <HStack spacing={3}>
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                w="220px"
                bg="rgba(8, 17, 15, 0.6)"
                color="#ffffff"
                borderRadius="xl"
              />
              <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} fontWeight="700" borderRadius="full" px={4} onClick={openAddAccountModal}>
                Create Account
              </Button>
            </HStack>
          </HStack>

          {/* ACCOUNT MODAL */}
          {showAccountModal && (
            <Box mb={6} p={5} borderRadius="2xl" bg="rgba(8, 17, 15, 0.95)">
              <HStack justify="space-between" mb={4}>
                <Heading size="sm" color="#ffffff" fontFamily="heading">
                  {editingAccount ? `Edit Account: ${editingAccount.name}` : 'Create New Account'}
                </Heading>
                <Button size="xs" variant="ghost" color="#ffffff" onClick={() => setShowAccountModal(false)}>
                  Close
                </Button>
              </HStack>

              <form onSubmit={handleAccountSubmit}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mb={4}>
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Account Name</Text>
                    <Input
                      value={accountFormData.name}
                      onChange={(e) => setAccountFormData({ ...accountFormData, name: e.target.value })}
                      placeholder="Acme Global Inc."
                      required
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Industry / Sector</Text>
                    <Input
                      value={accountFormData.industry}
                      onChange={(e) => setAccountFormData({ ...accountFormData, industry: e.target.value })}
                      placeholder="Technology, Finance, etc."
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Status</Text>
                    <select
                      value={accountFormData.status}
                      onChange={(e) => setAccountFormData({ ...accountFormData, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </Box>
                </Grid>

                <HStack justify="flex-end" spacing={3}>
                  <Button size="sm" variant="ghost" color="#ffffff" onClick={() => setShowAccountModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} type="submit" loading={formLoading} borderRadius="full" fontWeight="700">
                    {editingAccount ? 'Save Account' : 'Create Account'}
                  </Button>
                </HStack>
              </form>
            </Box>
          )}

          {/* ACCOUNTS LIST TABLE */}
          <VStack spacing={3} align="stretch">
            {filteredAccounts.map((acc) => (
              <HStack key={acc.id} p={4} borderRadius="xl" bg="rgba(8, 17, 15, 0.6)" justify="space-between" flexWrap="wrap" spacing={4}>
                <HStack spacing={4}>
                  <Text color="var(--text-muted)" fontFamily="mono" fontSize="xs">#{acc.id}</Text>
                  <Box>
                    <HStack spacing={2}>
                      <Text fontWeight="600" color="#ffffff">{acc.name}</Text>
                      <Badge bg="rgba(232, 185, 120, 0.25)" color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                        {acc.industry || 'General'}
                      </Badge>
                      <Badge bg={acc.status === 'active' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'} color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                        {acc.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="var(--text-soft)" mt={0.5}>
                      Projects: <strong>{acc.project_count ?? 0}</strong> | Linked Contacts: <strong>{acc.contact_count ?? 0}</strong>
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={2}>
                  <Button size="xs" bg="rgba(255, 255, 255, 0.12)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }} borderRadius="full" onClick={() => openEditAccountModal(acc)}>
                    Edit Account
                  </Button>
                  <Button size="xs" bg="rgba(185, 28, 28, 0.9)" color="#ffffff" _hover={{ bg: 'rgba(220, 38, 38, 1)' }} borderRadius="full" loading={actionLoadingId === `acc_${acc.id}`} onClick={() => handleDeleteAccount(acc)}>
                    Delete
                  </Button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PROJECTS TABLE */}
      {/* ========================================================= */}
      {activeTab === 'projects' && (
        <Box bg="var(--surface-strong)" backdropFilter="blur(16px)" p={6} borderRadius="2xl">
          <HStack justify="space-between" mb={6} flexWrap="wrap" spacing={4}>
            <Box>
              <Heading size="md" color="#ffffff" fontFamily="heading">
                Projects Table Console
              </Heading>
              <Text fontSize="xs" color="var(--text-soft)" mt={1}>
                Projects link to Accounts. Employee type users point directly to Projects.
              </Text>
            </Box>

            <HStack spacing={3}>
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                w="220px"
                bg="rgba(8, 17, 15, 0.6)"
                color="#ffffff"
                borderRadius="xl"
              />
              <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} fontWeight="700" borderRadius="full" px={4} onClick={openAddProjectModal}>
                Create Project
              </Button>
            </HStack>
          </HStack>

          {/* PROJECT MODAL */}
          {showProjectModal && (
            <Box mb={6} p={5} borderRadius="2xl" bg="rgba(8, 17, 15, 0.95)">
              <HStack justify="space-between" mb={4}>
                <Heading size="sm" color="#ffffff" fontFamily="heading">
                  {editingProject ? `Edit Project: ${editingProject.name}` : 'Create New Project'}
                </Heading>
                <Button size="xs" variant="ghost" color="#ffffff" onClick={() => setShowProjectModal(false)}>
                  Close
                </Button>
              </HStack>

              <form onSubmit={handleProjectSubmit}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Project Name</Text>
                    <Input
                      value={projectFormData.name}
                      onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                      placeholder="Project Apollo"
                      required
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Linked Account (Parent Account)</Text>
                    <select
                      value={projectFormData.account_id}
                      onChange={(e) => setProjectFormData({ ...projectFormData, account_id: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      <option value="">-- Standalone / Internal Project --</option>
                      {accountsList.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </Box>

                  <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Project Description</Text>
                    <Input
                      value={projectFormData.description}
                      onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                      placeholder="Project details and scope..."
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>
                </Grid>

                <HStack justify="flex-end" spacing={3}>
                  <Button size="sm" variant="ghost" color="#ffffff" onClick={() => setShowProjectModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} type="submit" loading={formLoading} borderRadius="full" fontWeight="700">
                    {editingProject ? 'Save Project' : 'Create Project'}
                  </Button>
                </HStack>
              </form>
            </Box>
          )}

          {/* PROJECTS LIST TABLE */}
          <VStack spacing={3} align="stretch">
            {filteredProjects.map((proj) => (
              <HStack key={proj.id} p={4} borderRadius="xl" bg="rgba(8, 17, 15, 0.6)" justify="space-between" flexWrap="wrap" spacing={4}>
                <HStack spacing={4}>
                  <Text color="var(--text-muted)" fontFamily="mono" fontSize="xs">#{proj.id}</Text>
                  <Box>
                    <HStack spacing={2}>
                      <Text fontWeight="600" color="#ffffff">{proj.name}</Text>
                      {proj.account_name && (
                        <Badge bg="rgba(59, 130, 246, 0.3)" color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                          Account: {proj.account_name}
                        </Badge>
                      )}
                      <Badge bg="rgba(16, 185, 129, 0.25)" color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                        {proj.status}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="var(--text-soft)" mt={0.5}>
                      {proj.description || 'No description provided'} • Assigned Employees: <strong>{proj.assigned_employee_count ?? 0}</strong>
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={2}>
                  <Button size="xs" bg="rgba(255, 255, 255, 0.12)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }} borderRadius="full" onClick={() => openEditProjectModal(proj)}>
                    Edit Project
                  </Button>
                  <Button size="xs" bg="rgba(185, 28, 28, 0.9)" color="#ffffff" _hover={{ bg: 'rgba(220, 38, 38, 1)' }} borderRadius="full" loading={actionLoadingId === `proj_${proj.id}`} onClick={() => handleDeleteProject(proj)}>
                    Delete
                  </Button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 4: RBAC GROUPS CONSOLE */}
      {/* ========================================================= */}
      {activeTab === 'groups' && (
        <Box bg="var(--surface-strong)" backdropFilter="blur(16px)" p={6} borderRadius="2xl">
          <HStack justify="space-between" mb={6} flexWrap="wrap" spacing={4}>
            <Box>
              <Heading size="md" color="#ffffff" fontFamily="heading">
                Role-Based Access Control (RBAC) Groups Console
              </Heading>
              <Text fontSize="xs" color="var(--text-soft)" mt={1}>
                Roles are mapped to Groups (AWS / ServiceNow model). Individual users belong to Groups and inherit all assigned roles.
              </Text>
            </Box>

            <HStack spacing={3}>
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                w="220px"
                bg="rgba(8, 17, 15, 0.6)"
                color="#ffffff"
                borderRadius="xl"
              />
              <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} fontWeight="700" borderRadius="full" px={4} onClick={openAddGroupModal}>
                Create Group
              </Button>
            </HStack>
          </HStack>

          {/* GROUP MODAL */}
          {showGroupModal && (
            <Box mb={6} p={5} borderRadius="2xl" bg="rgba(8, 17, 15, 0.95)">
              <HStack justify="space-between" mb={4}>
                <Heading size="sm" color="#ffffff" fontFamily="heading">
                  {editingGroup ? `Edit Group: ${editingGroup.name}` : 'Create New Security Group'}
                </Heading>
                <Button size="xs" variant="ghost" color="#ffffff" onClick={() => setShowGroupModal(false)}>
                  Close
                </Button>
              </HStack>

              <form onSubmit={handleGroupSubmit}>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Group Name</Text>
                    <Input
                      value={groupFormData.name}
                      onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                      placeholder="e.g. Operations Team"
                      required
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="var(--text-soft)" mb={1} fontWeight="600">Description</Text>
                    <Input
                      value={groupFormData.description}
                      onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                      placeholder="Group purpose and permissions scope..."
                      bg="rgba(15, 23, 42, 0.6)"
                      color="#ffffff"
                    />
                  </Box>

                  {/* ROLE ASSIGNMENTS TO GROUP */}
                  <Box gridColumn={{ base: 'span 1', md: 'span 2' }}>
                    <Text fontSize="xs" color="#ffffff" mb={2} fontWeight="600">Assigned Roles to this Group (Select all that apply):</Text>
                    <HStack flexWrap="wrap" gap={2}>
                      {rolesList.map((r) => {
                        const isAssigned = groupFormData.role_ids.includes(r.id)
                        return (
                          <Button
                            key={r.id}
                            type="button"
                            size="sm"
                            borderRadius="full"
                            bg={isAssigned ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.06)'}
                            color="#ffffff"
                            onClick={() => {
                              const newRoleIds = isAssigned
                                ? groupFormData.role_ids.filter((id) => id !== r.id)
                                : [...groupFormData.role_ids, r.id]
                              setGroupFormData({ ...groupFormData, role_ids: newRoleIds })
                            }}
                          >
                            {r.name}
                          </Button>
                        )
                      })}
                    </HStack>
                  </Box>
                </Grid>

                <HStack justify="flex-end" spacing={3}>
                  <Button size="sm" variant="ghost" color="#ffffff" onClick={() => setShowGroupModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" bg="rgba(255, 255, 255, 0.16)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.24)' }} type="submit" loading={formLoading} borderRadius="full" fontWeight="700">
                    {editingGroup ? 'Save Group' : 'Create Group'}
                  </Button>
                </HStack>
              </form>
            </Box>
          )}

          {/* GROUPS LIST TABLE */}
          <VStack spacing={3} align="stretch">
            {filteredGroups.map((g) => (
              <HStack key={g.id} p={4} borderRadius="xl" bg="rgba(8, 17, 15, 0.6)" justify="space-between" flexWrap="wrap" spacing={4}>
                <HStack spacing={4}>
                  <Text color="var(--text-muted)" fontFamily="mono" fontSize="xs">#{g.id}</Text>
                  <Box>
                    <HStack spacing={2} flexWrap="wrap">
                      <Text fontWeight="600" color="#ffffff">{g.name}</Text>
                      <Badge bg="rgba(232, 185, 120, 0.25)" color="#ffffff" fontSize="xs" px={2.5} py={0.5} borderRadius="full">
                        Members: {g.member_count ?? 0}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="var(--text-soft)" mt={0.5}>
                      {g.description || 'No description provided'}
                    </Text>

                    {/* Roles mapped to group */}
                    {g.assigned_roles && g.assigned_roles.length > 0 && (
                      <HStack spacing={1} mt={1.5} flexWrap="wrap">
                        <Text fontSize="xs" color="var(--text-muted)">Attached Roles:</Text>
                        {g.assigned_roles.map((rn, idx) => (
                          <Badge key={idx} bg="rgba(59, 130, 246, 0.3)" color="#ffffff" fontSize="xs" px={2.5} py={0.2} borderRadius="full">
                            {rn}
                          </Badge>
                        ))}
                      </HStack>
                    )}
                  </Box>
                </HStack>

                <HStack spacing={2}>
                  <Button size="xs" bg="rgba(255, 255, 255, 0.12)" color="#ffffff" _hover={{ bg: 'rgba(255, 255, 255, 0.2)' }} borderRadius="full" onClick={() => openEditGroupModal(g)}>
                    Edit Roles / Group
                  </Button>
                  <Button size="xs" bg="rgba(185, 28, 28, 0.9)" color="#ffffff" _hover={{ bg: 'rgba(220, 38, 38, 1)' }} borderRadius="full" loading={actionLoadingId === `group_${g.id}`} onClick={() => handleDeleteGroup(g)}>
                    Delete Group
                  </Button>
                </HStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  )
}

export default AdminDashboard
