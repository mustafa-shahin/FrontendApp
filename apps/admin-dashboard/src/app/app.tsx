import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { Dashboard } from '../pages/Dashboard';
import { Files } from '../pages/Files';
import { Images } from '../pages/Images';
import { Documents } from '../pages/Documents';
import { Videos } from '../pages/Videos';
import { Audio } from '../pages/Audio';
import { Folders } from '../pages/Folders';
import { Users } from '../pages/Users';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* File Management */}
      <Route path="/files" element={<Files />} />
      <Route path="/files/images" element={<Images />} />
      <Route path="/files/documents" element={<Documents />} />
      <Route path="/files/videos" element={<Videos />} />
      <Route path="/files/audio" element={<Audio />} />
      <Route path="/files/folders" element={<Folders />} />

      {/* Legacy routes for backwards compatibility */}
      <Route
        path="/documents"
        element={<Navigate to="/files/documents" replace />}
      />
      <Route path="/images" element={<Navigate to="/files/images" replace />} />
      <Route path="/videos" element={<Navigate to="/files/videos" replace />} />
      <Route path="/audio" element={<Navigate to="/files/audio" replace />} />

      {/* Folder Management */}
      <Route path="/folders" element={<Folders />} />

      {/* User Management */}
      <Route path="/users" element={<Users />} />

      {/* Settings */}
      <Route path="/settings" element={<Settings />} />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
