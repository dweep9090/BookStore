import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { JSX } from 'react'

export function ProtectedRoute({ children, role }: { children: JSX.Element; role?: 'ADMIN' | 'BUYER' }) {
  const { user, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}