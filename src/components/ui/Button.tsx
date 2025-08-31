import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost' | 'outline' | 'gradient-primary' | 'gradient-success' | 'gradient-warning' | 'gradient-error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  hover?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    hover = true,
    disabled,
    children,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const hoverStyles = hover ? 'transform hover:scale-[1.02]' : '';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-medium focus:ring-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-soft hover:shadow-medium focus:ring-secondary-500',
      accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-soft hover:shadow-medium focus:ring-accent-500',
      success: 'bg-success-600 hover:bg-success-700 text-white shadow-soft hover:shadow-medium focus:ring-success-500',
      warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-soft hover:shadow-medium focus:ring-warning-500',
      error: 'bg-error-600 hover:bg-error-700 text-white shadow-soft hover:shadow-medium focus:ring-error-500',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 focus:ring-neutral-500',
      outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500',
      'gradient-primary': 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-soft hover:shadow-medium focus:ring-purple-500',
      'gradient-success': 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-soft hover:shadow-medium focus:ring-green-500',
      'gradient-warning': 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white shadow-soft hover:shadow-medium focus:ring-yellow-500',
      'gradient-error': 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-soft hover:shadow-medium focus:ring-red-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
      md: 'px-4 py-2 text-base rounded-xl gap-2',
      lg: 'px-6 py-3 text-lg rounded-2xl gap-2.5',
      xl: 'px-8 py-4 text-xl rounded-3xl gap-3',
    };
    
    const LoadingSpinner = () => (
      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          hoverStyles,
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };