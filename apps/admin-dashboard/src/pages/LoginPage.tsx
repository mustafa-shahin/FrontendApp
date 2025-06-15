import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Checkbox } from '../components/ui/Checkbox';
import { LoginDto } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: keyof LoginDto) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      }));
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-cube text-white text-xl" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to CMS Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your content with ease
          </p>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            icon={theme === 'light' ? 'moon' : 'sun'}
            onClick={toggleTheme}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-circle mr-2" />
                  {error}
                </div>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              icon="envelope"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              icon="lock"
              required
            />

            <Checkbox
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleChange('rememberMe')}
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={!formData.email || !formData.password}
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Demo credentials: admin@demo.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};
