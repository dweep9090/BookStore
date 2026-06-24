import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface User { id: string; name: string; email: string; role: 'BUYER' | 'ADMIN' }
interface AuthContextType {
  user: User | null
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

    const logout = () => {
        setUser(null)

        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)