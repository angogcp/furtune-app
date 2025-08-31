import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, AlertCircle, Info, X, TriangleAlert } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 入场动画
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // 自动关闭
    const hideTimer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <TriangleAlert className="w-5 h-5 text-yellow-400" />
  };

  const styles = {
    success: 'border-emerald-500/50 bg-emerald-900/20',
    error: 'border-red-500/50 bg-red-900/20',
    info: 'border-blue-500/50 bg-blue-900/20',
    warning: 'border-yellow-500/50 bg-yellow-900/20'
  };

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-50 w-96 max-w-sm',
        'transform transition-all duration-300 ease-out',
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div
        className={cn(
          'rounded-xl border-2 backdrop-blur-sm p-4 shadow-2xl',
          styles[type]
        )}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-1">
              {title}
            </h4>
            {description && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* 进度条 */}
        <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all ease-linear',
              type === 'success' && 'bg-emerald-400',
              type === 'error' && 'bg-red-400',
              type === 'info' && 'bg-blue-400'
            )}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Toast 容器组件
export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 80}px)`
          }}
        >
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, description?: string) => {
    addToast({ type: 'success', title, description });
  };

  const showError = (title: string, description?: string) => {
    addToast({ type: 'error', title, description });
  };

  const showInfo = (title: string, description?: string) => {
    addToast({ type: 'info', title, description });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast
  };
}

export default Toast;

// 添加 CSS 动画
const injectToastStyles = () => {
  // Only run on client side
  if (typeof document === 'undefined') return;
  
  // Check if styles already exist to prevent duplicates
  if (document.getElementById('toast-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = 
    '@keyframes shrink {' +
    '  from { width: 100%; }' +
    '  to { width: 0%; }' +
    '}';
  document.head.appendChild(style);
};

// Inject styles when module loads
injectToastStyles();