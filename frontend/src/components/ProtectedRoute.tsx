import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute: React.FC = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const hasHydrated = useAuthStore((s) => s._hasHydrated);

    // Wait for Zustand to finish loading from localStorage
    if (!hasHydrated) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // No role check here — AdminLayout handles sidebar visibility,
    // and the backend protects admin endpoints with isAdmin middleware.
    return <Outlet />;
};

export default ProtectedRoute;
