import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UseToastResult {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToast = (): UseToastResult => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, type, message, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-hide toast after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    []
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    hideToast,
    clearToasts,
  };
};

// apps/admin-dashboard/src/utils/fileUtils.ts
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (contentType: string, fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // Image files
  if (contentType.startsWith('image/')) {
    return 'image';
  }

  // Video files
  if (contentType.startsWith('video/')) {
    return 'video';
  }

  // Audio files
  if (contentType.startsWith('audio/')) {
    return 'music';
  }

  // Document files
  if (contentType.includes('pdf') || extension === 'pdf') {
    return 'file-pdf';
  }

  if (contentType.includes('word') || ['doc', 'docx'].includes(extension)) {
    return 'file-word';
  }

  if (contentType.includes('sheet') || ['xls', 'xlsx'].includes(extension)) {
    return 'file-excel';
  }

  if (
    contentType.includes('presentation') ||
    ['ppt', 'pptx'].includes(extension)
  ) {
    return 'file-powerpoint';
  }

  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'file-archive';
  }

  // Text files
  if (
    contentType.startsWith('text/') ||
    ['txt', 'md', 'json', 'xml'].includes(extension)
  ) {
    return 'file-alt';
  }

  // Default file icon
  return 'file';
};

export const isImage = (contentType: string): boolean => {
  return contentType.startsWith('image/');
};

export const isVideo = (contentType: string): boolean => {
  return contentType.startsWith('video/');
};

export const isAudio = (contentType: string): boolean => {
  return contentType.startsWith('audio/');
};

export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(extension) || allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize * 1024 * 1024; // maxSize in MB
};

// apps/admin-dashboard/src/utils/dateUtils.ts
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};

export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return date.toDateString() === yesterday.toDateString();
};

// apps/admin-dashboard/src/utils/validationUtils.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (
  username: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push(
      'Username can only contain letters, numbers, hyphens, and underscores'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// apps/admin-dashboard/src/utils/storageUtils.ts
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue || null;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
  }
};

export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

// Session storage utilities
export const setSessionStorage = (key: string, value: any): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to sessionStorage:', error);
  }
};

export const getSessionStorage = <T>(
  key: string,
  defaultValue?: T
): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Failed to read from sessionStorage:', error);
    return defaultValue || null;
  }
};

export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove from sessionStorage:', error);
  }
};

export const clearSessionStorage = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error);
  }
};
