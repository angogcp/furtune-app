import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  success?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    inputSize = 'md',
    error = false,
    success = false,
    leftIcon,
    rightIcon,
    label,
    helperText,
    errorText,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      default: 'border border-neutral-300 bg-white focus:border-primary-500 focus:ring-primary-500/20',
      filled: 'border-0 bg-neutral-100 focus:bg-white focus:ring-primary-500/20',
      outlined: 'border-2 border-neutral-300 bg-transparent focus:border-primary-500 focus:ring-primary-500/20',
    };
    
    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-3 text-base rounded-xl',
      lg: 'px-5 py-4 text-lg rounded-2xl',
    };
    
    const stateStyles = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
      : success
      ? 'border-success-500 focus:border-success-500 focus:ring-success-500/20'
      : '';
    
    const iconPadding = {
      sm: leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '',
      md: leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '',
      lg: leftIcon ? 'pl-14' : rightIcon ? 'pr-14' : '',
    };
    
    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };
    
    const iconPositions = {
      sm: { left: 'left-3', right: 'right-3' },
      md: { left: 'left-4', right: 'right-4' },
      lg: { left: 'left-5', right: 'right-5' },
    };
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute top-1/2 transform -translate-y-1/2 text-neutral-400',
              iconPositions[inputSize].left
            )}>
              <div className={iconSizes[inputSize]}>
                {leftIcon}
              </div>
            </div>
          )}
          <input
            className={cn(
              baseStyles,
              variants[variant],
              sizes[inputSize],
              iconPadding[inputSize],
              stateStyles,
              className
            )}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className={cn(
              'absolute top-1/2 transform -translate-y-1/2 text-neutral-400',
              iconPositions[inputSize].right
            )}>
              <div className={iconSizes[inputSize]}>
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        {(helperText || errorText) && (
          <p className={cn(
            'mt-2 text-sm',
            error ? 'text-error-600' : 'text-neutral-600'
          )}>
            {error ? errorText : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };