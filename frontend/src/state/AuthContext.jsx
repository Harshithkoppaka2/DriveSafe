import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { attachToken } from '../api/http.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'drivesafe.session'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => { attachToken(session?.token) }, [session])

  const value = useMemo(() => ({
    session,
    signIn(next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSession(next)
    },
    signOut() {
      localStorage.removeItem(STORAGE_KEY)
      setSession(null)
    }
  }), [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
