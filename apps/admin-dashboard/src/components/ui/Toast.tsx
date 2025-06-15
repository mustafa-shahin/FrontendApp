import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onClose]);

  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const typeIcons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle',
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        typeClasses[type]
      } transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center space-x-2">
        <i className={`fas fa-${typeIcons[type]} w-5 h-5`} />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <i className="fas fa-times w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
