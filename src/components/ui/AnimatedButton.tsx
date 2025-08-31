import React, { useState, memo } from 'react';
import { cn } from '../../utils/cn';
import { Button, type ButtonProps } from './Button';

export interface AnimatedButtonProps extends ButtonProps {
  animationType?: 'bounce' | 'pulse' | 'shake' | 'glow' | 'ripple' | 'slide';
  rippleColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  autoAnimate?: boolean;
  animationDuration?: number;
}

const AnimatedButton = memo(React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({
    className,
    animationType = 'bounce',
    rippleColor = 'white',
    glowIntensity = 'medium',
    autoAnimate = false,
    animationDuration = 300,
    children,
    onClick,
    ...props
  }, ref) => {
    const [isAnimating, setIsAnimating] = useState(autoAnimate);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const glowIntensities = {
      low: 'shadow-md',
      medium: 'shadow-lg shadow-current/30',
      high: 'shadow-xl shadow-current/50',
    };

    const animations = {
      bounce: 'animate-bounce-soft',
      pulse: 'animate-pulse-soft',
      shake: 'animate-shake',
      glow: `${glowIntensities[glowIntensity]} animate-glow`,
      ripple: 'relative overflow-hidden',
      slide: 'animate-slide-in',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animationType === 'ripple') {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };
        
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }

      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), animationDuration);
      
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(
          animations[animationType],
          isAnimating && 'animate-active',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {animationType === 'ripple' && (
          <>
            {ripples.map(ripple => (
              <span
                key={ripple.id}
                className={cn(
                  'absolute rounded-full animate-ripple pointer-events-none',
                  `bg-${rippleColor}/30`
                )}
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
              />
            ))}
          </>
        )}
        {children}
      </Button>
    );
  }
));

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };