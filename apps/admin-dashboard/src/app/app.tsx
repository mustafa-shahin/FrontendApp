import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileManagerProvider } from '../contexts/FileManagerContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LoginPage } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';
import { FileManager } from '../pages/FileManager';
import { UserManagement } from '../pages/UserManagement';
import { NotFound } from '../pages/NotFound';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/files/*"
          element={
            <ProtectedRoute>
              <FileManagerProvider>
                <Routes>
                  <Route index element={<FileManager />} />
                  <Route path="folders" element={<FileManager />} />
                  <Route path="images" element={<FileManager />} />
                  <Route path="documents" element={<FileManager />} />
                  <Route path="videos" element={<FileManager />} />
                  <Route path="audio" element={<FileManager />} />
                  <Route path="folder/:folderId" element={<FileManager />} />
                </Routes>
              </FileManagerProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
