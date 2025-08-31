import React from 'react';
import type { Toast } from './useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const getToastColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 ${getToastColor(toast.type)} animate-in slide-in-from-right`}
          onClick={() => onRemove(toast.id)}
        >
          <div className="font-semibold">{toast.title}</div>
          {toast.message && (
            <div className="text-sm opacity-90">{toast.message}</div>
          )}
        </div>
      ))}
    </div>
  );
};