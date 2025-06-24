import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Monitor } from 'lucide-react';

export const AuthLayout = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-websign-50 to-websign-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-websign-600 p-3 rounded-full">
              <Monitor className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">WebSign</h2>
          <p className="mt-2 text-sm text-gray-600">Digital Signage Platform</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};