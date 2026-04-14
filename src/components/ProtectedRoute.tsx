import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/types';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children, allowedRoles }: { children: ReactNode; allowedRoles?: Role[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/my-tasks'} replace />;
  }

  return <>{children}</>;
}
