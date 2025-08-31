import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  variant?: 'default' | 'gradient-primary' | 'gradient-secondary' | 'gradient-accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  showCheckmark?: boolean;
  interactive?: boolean;
}

const SelectableCard = React.forwardRef<HTMLDivElement, SelectableCardProps>(
  ({
    className,
    selected = false,
    variant = 'default',
    size = 'md',
    icon,
    title,
    description,
    showCheckmark = true,
    interactive = true,
    children,
    ...props
  }, ref) => {
    const variants = {
      default: {
        selected: 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-purple-400/10 to-pink-400/20 shadow-2xl shadow-yellow-400/30',
        unselected: 'border-purple-400/40 bg-gradient-to-br from-purple-900/40 via-indigo-800/30 to-blue-900/40 hover:border-purple-300/70 hover:shadow-xl hover:shadow-purple-400/20'
      },
      'gradient-primary': {
        selected: 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-blue-400/10 to-purple-400/20 shadow-2xl shadow-yellow-400/30',
        unselected: 'border-blue-400/40 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-indigo-900/40 hover:border-blue-300/70 hover:shadow-xl hover:shadow-blue-400/20'
      },
      'gradient-secondary': {
        selected: 'border-yellow-400 bg-gradient-to-br from-yellow-400/20 via-orange-400/10 to-red-400/20 shadow-2xl shadow-yellow-400/30',
        unselected: 'border-orange-400/40 bg-gradient-to-br from-orange-900/40 via-red-800/30 to-pink-900/40 hover:border-orange-300/70 hover:shadow-xl hover:shadow-orange-400/20'
      },
      'gradient-accent': {
        selected: 'border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/50',
        unselected: 'border-purple-400/30 bg-purple-900/30 hover:border-purple-400/60'
      }
    };

    const sizes = {
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8'
    };

    const iconSizes = {
      sm: 'w-6 h-6',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    const titleSizes = {
      sm: 'text-sm',
      md: 'text-lg',
      lg: 'text-xl'
    };

    const descriptionSizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm'
    };

    const baseStyles = 'group relative border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer';
    const variantStyles = selected ? variants[variant].selected : variants[variant].unselected;
    const interactiveStyles = interactive ? 'focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2' : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles,
          sizes[size],
          interactiveStyles,
          'rounded-xl',
          className
        )}
        {...props}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          {icon && (
            <div className={cn(
              iconSizes[size],
              'mx-auto mb-4 transition-all duration-300',
              selected ? 'text-yellow-400 drop-shadow-lg' : 'text-purple-300 group-hover:text-purple-200'
            )}>
              {icon}
            </div>
          )}
          
          {title && (
            <h3 className={cn(
              titleSizes[size],
              'font-bold mb-3 transition-colors duration-300'
            )}>
              {title}
            </h3>
          )}
          
          {description && (
            <p className={cn(
              descriptionSizes[size],
              'text-gray-300 leading-relaxed'
            )}>
              {description}
            </p>
          )}
          
          {children}
        </div>
        
        {/* Checkmark */}
        {selected && showCheckmark && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-purple-900 text-sm font-bold">✓</span>
          </div>
        )}
      </div>
    );
  }
);

SelectableCard.displayName = 'SelectableCard';

export { SelectableCard };