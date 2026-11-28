import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const sessionExpiresAt = user?.sessionExpiresAt

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiRequest('/auth/me')
      setUser(response.data)
      return response.data
    } catch (error) {
      if (error.status !== 401) throw error
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser().catch(() => setLoading(false))
  }, [refreshUser])

  useEffect(() => {
    if (!sessionExpiresAt) return undefined
    const expiresAt = Date.parse(sessionExpiresAt)
    const delay = Number.isFinite(expiresAt) ? Math.max(expiresAt - Date.now(), 0) : 0
    const timeout = window.setTimeout(() => setUser(null), delay)
    return () => window.clearTimeout(timeout)
  }, [sessionExpiresAt])

  const login = useCallback(async (loginValue, password) => {
    await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login: loginValue, password }),
    })
    return refreshUser()
  }, [refreshUser])

  const register = useCallback(async ({ email, phone, password, fullName }) => {
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        phone: phone || undefined,
        password,
        fullName,
      }),
    })
    return refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => undefined)
    setUser(null)
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }), [user, loading, login, register, logout, refreshUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
