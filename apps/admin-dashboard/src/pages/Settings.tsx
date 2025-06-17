import React from 'react';
import { Layout } from '../components/ui/layout/Layout';
import { PageHeader } from '../components/ui/layout/PageHeader';

export const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          subtitle="Configure your application settings"
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <i className="fas fa-cog text-3xl text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Settings Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This page will contain application configuration options.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
