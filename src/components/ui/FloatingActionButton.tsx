import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

export interface FloatingAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

export interface FloatingActionButtonProps {
  className?: string;
  actions: FloatingAction[];
  mainIcon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'circular' | 'rounded';
  expandDirection?: 'up' | 'down' | 'left' | 'right';
  autoClose?: boolean;
  tooltip?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  className,
  actions,
  mainIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  position = 'bottom-right',
  size = 'md',
  variant = 'circular',
  expandDirection = 'up',
  autoClose = true,
  tooltip = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const positions = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const actionSizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
  };

  const variants = {
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  const getActionPosition = (index: number) => {
    const spacing = size === 'sm' ? 60 : size === 'md' ? 70 : 80;
    const offset = (index + 1) * spacing;

    switch (expandDirection) {
      case 'up':
        return { transform: `translateY(-${offset}px)` };
      case 'down':
        return { transform: `translateY(${offset}px)` };
      case 'left':
        return { transform: `translateX(-${offset}px)` };
      case 'right':
        return { transform: `translateX(${offset}px)` };
      default:
        return { transform: `translateY(-${offset}px)` };
    }
  };

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action: FloatingAction) => {
    action.onClick();
    if (autoClose) {
      setIsExpanded(false);
    }
  };

  return (
    <div className={cn(positions[position], 'z-50', className)}>
      {/* 背景遮罩 */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* 动作按钮 */}
      {actions.map((action, index) => (
        <div
          key={action.id}
          className={cn(
            'absolute transition-all duration-300 ease-out',
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'
          )}
          style={{
            ...getActionPosition(index),
            transitionDelay: isExpanded ? `${index * 50}ms` : `${(actions.length - index - 1) * 50}ms`,
          }}
        >
          {/* 工具提示 */}
          {tooltip && hoveredAction === action.id && (
            <div
              className={cn(
                'absolute bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap',
                'transform -translate-y-1/2 transition-all duration-200',
                expandDirection === 'left' ? 'right-full mr-3' : 'left-full ml-3'
              )}
              style={{ top: '50%' }}
            >
              {action.label}
              <div
                className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45',
                  expandDirection === 'left' ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                )}
              />
            </div>
          )}

          <Button
            className={cn(
              actionSizes[size],
              variants[variant],
              'shadow-lg hover:shadow-xl transform hover:scale-110',
              'transition-all duration-200',
              action.color || 'bg-white text-gray-700 hover:bg-gray-50'
            )}
            onClick={() => handleActionClick(action)}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
          >
            {action.icon}
          </Button>
        </div>
      ))}

      {/* 主按钮 */}
      <Button
        className={cn(
          sizes[size],
          variants[variant],
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
          'shadow-lg hover:shadow-xl transform hover:scale-110',
          'transition-all duration-300',
          isExpanded && 'rotate-45'
        )}
        onClick={handleMainClick}
      >
        {mainIcon}
      </Button>
    </div>
  );
};

export { FloatingActionButton };