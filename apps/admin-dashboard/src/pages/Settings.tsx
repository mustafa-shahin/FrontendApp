// import React, { useState } from 'react';
// import { Layout } from '../components/layout/Layout';
// import { PageHeader } from '../components/layout/PageHeader';
// import { Button } from '../components/ui/Button';
// import { Input } from '../components/ui/Input';
// import { Textarea } from '../components/ui/Textarea';
// import { Select } from '../components/ui/Select';
// import { Checkbox } from '../components/ui/Checkbox';
// import { useTheme } from '../contexts/ThemeContext';
// import { useAuth } from '../contexts/AuthContext';

// interface SystemSettings {
//   siteName: string;
//   siteDescription: string;
//   adminEmail: string;
//   timezone: string;
//   language: string;
//   allowRegistration: boolean;
//   requireEmailVerification: boolean;
//   maxFileUploadSize: number;
//   allowedFileTypes: string[];
// }

// export const Settings: React.FC = () => {
//   const { theme, setTheme } = useTheme();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('general');

//   const [settings, setSettings] = useState<SystemSettings>({
//     siteName: 'CMS Admin',
//     siteDescription: 'Content Management System',
//     adminEmail: 'admin@demo.com',
//     timezone: 'UTC',
//     language: 'en',
//     allowRegistration: false,
//     requireEmailVerification: true,
//     maxFileUploadSize: 10,
//     allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
//   });

//   const timezoneOptions = [
//     { value: 'UTC', label: 'UTC' },
//     { value: 'America/New_York', label: 'Eastern Time' },
//     { value: 'America/Chicago', label: 'Central Time' },
//     { value: 'America/Denver', label: 'Mountain Time' },
//     { value: 'America/Los_Angeles', label: 'Pacific Time' },
//     { value: 'Europe/London', label: 'London' },
//     { value: 'Europe/Paris', label: 'Paris' },
//     { value: 'Asia/Tokyo', label: 'Tokyo' },
//   ];

//   const languageOptions = [
//     { value: 'en', label: 'English' },
//     { value: 'es', label: 'Spanish' },
//     { value: 'fr', label: 'French' },
//     { value: 'de', label: 'German' },
//     { value: 'it', label: 'Italian' },
//   ];

//   const themeOptions = [
//     { value: 'light', label: 'Light' },
//     { value: 'dark', label: 'Dark' },
//   ];

//   const handleSaveSettings = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log('Settings saved:', settings);
//     } catch (error) {
//       console.error('Failed to save settings:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = [
//     { id: 'general', label: 'General', icon: 'cog' },
//     { id: 'security', label: 'Security', icon: 'shield-alt' },
//     { id: 'files', label: 'File Management', icon: 'file' },
//     { id: 'appearance', label: 'Appearance', icon: 'palette' },
//   ];

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <PageHeader
//           title="Settings"
//           subtitle="Configure your CMS system settings"
//         />

//         <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
//           {/* Tabs */}
//           <div className="border-b border-gray-200 dark:border-gray-700">
//             <nav className="flex space-x-8 px-6">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === tab.id
//                       ? 'border-blue-500 text-blue-600 dark:text-blue-400'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
//                   }`}
//                 >
//                   <i className={`fas fa-${tab.icon} mr-2`} />
//                   {tab.label}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'general' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   General Settings
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Input
//                     label="Site Name"
//                     value={settings.siteName}
//                     onChange={(e) =>
//                       setSettings({ ...settings, siteName: e.target.value })
//                     }
//                     placeholder="Enter site name"
//                   />

//                   <Input
//                     label="Admin Email"
//                     type="email"
//                     value={settings.adminEmail}
//                     onChange={(e) =>
//                       setSettings({ ...settings, adminEmail: e.target.value })
//                     }
//                     placeholder="Enter admin email"
//                   />
//                 </div>

//                 <Textarea
//                   label="Site Description"
//                   value={settings.siteDescription}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       siteDescription: e.target.value,
//                     })
//                   }
//                   placeholder="Enter site description"
//                   rows={3}
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Select
//                     label="Timezone"
//                     value={settings.timezone}
//                     onChange={(e) =>
//                       setSettings({ ...settings, timezone: e.target.value })
//                     }
//                     options={timezoneOptions}
//                   />

//                   <Select
//                     label="Language"
//                     value={settings.language}
//                     onChange={(e) =>
//                       setSettings({ ...settings, language: e.target.value })
//                     }
//                     options={languageOptions}
//                   />
//                 </div>
//               </div>
//             )}

//             {activeTab === 'security' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   Security Settings
//                 </h3>

//                 <div className="space-y-4">
//                   <Checkbox
//                     label="Allow User Registration"
//                     checked={settings.allowRegistration}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         allowRegistration: e.target.checked,
//                       })
//                     }
//                   />

//                   <Checkbox
//                     label="Require Email Verification"
//                     checked={settings.requireEmailVerification}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         requireEmailVerification: e.target.checked,
//                       })
//                     }
//                   />
//                 </div>

//                 <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//                   <div className="flex">
//                     <i className="fas fa-exclamation-triangle text-yellow-400 mr-3 mt-1" />
//                     <div>
//                       <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
//                         Security Notice
//                       </h4>
//                       <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
//                         Changes to security settings will affect all users.
//                         Please review carefully before saving.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'files' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   File Management Settings
//                 </h3>

//                 <Input
//                   label="Maximum File Upload Size (MB)"
//                   type="number"
//                   value={settings.maxFileUploadSize}
//                   onChange={(e) =>
//                     setSettings({
//                       ...settings,
//                       maxFileUploadSize: Number(e.target.value),
//                     })
//                   }
//                   placeholder="Enter max file size"
//                   min={1}
//                   max={100}
//                 />

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Allowed File Types
//                   </label>
//                   <Textarea
//                     value={settings.allowedFileTypes.join(', ')}
//                     onChange={(e) =>
//                       setSettings({
//                         ...settings,
//                         allowedFileTypes: e.target.value
//                           .split(',')
//                           .map((type) => type.trim()),
//                       })
//                     }
//                     placeholder="Enter allowed file types separated by commas"
//                     rows={3}
//                   />
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Separate file extensions with commas (e.g., jpg, png, pdf)
//                   </p>
//                 </div>
//               </div>
//             )}

//             {activeTab === 'appearance' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   Appearance Settings
//                 </h3>

//                 <Select
//                   label="Theme"
//                   value={theme}
//                   onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
//                   options={themeOptions}
//                 />

//                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                   <div className="flex">
//                     <i className="fas fa-info-circle text-blue-400 mr-3 mt-1" />
//                     <div>
//                       <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
//                         Theme Information
//                       </h4>
//                       <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
//                         Theme changes are applied immediately and saved
//                         automatically.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Save Button */}
//             <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
//               <Button
//                 onClick={handleSaveSettings}
//                 loading={loading}
//                 icon="save"
//               >
//                 Save Settings
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };
