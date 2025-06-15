import React, { useState, useEffect } from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { fileService } from '../services/file.service';

interface DashboardStats {
  totalFiles: number;
  totalFolders: number;
  totalSize: string;
  recentFiles: any[];
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load statistics and recent files
      const [fileStats, recentFiles] = await Promise.all([
        fileService.getFileStatistics(),
        fileService.getRecentFiles(10),
      ]);

      setStats({
        totalFiles: fileStats.totalFiles || 0,
        totalFolders: fileStats.totalFolders || 0,
        totalSize: fileStats.totalSizeFormatted || '0 Bytes',
        recentFiles,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          subtitle="Welcome to your CMS Admin Dashboard"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-file text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Files
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalFiles.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-folder text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Folders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalFolders.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-hdd text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalSize || '0 Bytes'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="primary"
              icon="upload"
              onClick={() => (window.location.href = '/files')}
              className="w-full"
            >
              Upload Files
            </Button>
            <Button
              variant="secondary"
              icon="folder-plus"
              onClick={() => (window.location.href = '/files')}
              className="w-full"
            >
              Create Folder
            </Button>
            <Button
              variant="secondary"
              icon="users"
              onClick={() => (window.location.href = '/users')}
              className="w-full"
            >
              Manage Users
            </Button>
            <Button
              variant="secondary"
              icon="cog"
              onClick={() => (window.location.href = '/settings')}
              className="w-full"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Recent Files */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Files
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (window.location.href = '/files')}
              >
                View All
              </Button>
            </div>
          </div>

          <div className="p-6">
            {stats?.recentFiles.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent files
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.originalFileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="download"
                      onClick={() =>
                        window.open(
                          fileService.getDownloadUrl(file.id),
                          '_blank'
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
