import React, { useState, memo } from 'react';
import { cn } from '../../utils/cn';
import { Card, type CardProps } from './Card';

export interface AnimatedCardProps extends CardProps {
  animationType?: 'fade' | 'slide' | 'scale' | 'flip' | 'glow' | 'float';
  delay?: number;
  duration?: number;
  triggerOnHover?: boolean;
  triggerOnClick?: boolean;
  glowColor?: string;
}

const AnimatedCard = memo(React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({
    className,
    animationType = 'fade',
    delay = 0,
    duration = 300,
    triggerOnHover = false,
    triggerOnClick = false,
    glowColor = 'purple',
    children,
    ...props
  }, ref) => {
    const [isAnimated, setIsAnimated] = useState(!triggerOnHover && !triggerOnClick);
    const [isClicked, setIsClicked] = useState(false);

    const animations = {
      fade: {
        initial: 'opacity-0',
        animate: 'opacity-100',
        transition: `transition-opacity duration-${duration}`,
      },
      slide: {
        initial: 'transform translate-y-8 opacity-0',
        animate: 'transform translate-y-0 opacity-100',
        transition: `transition-all duration-${duration} ease-out`,
      },
      scale: {
        initial: 'transform scale-95 opacity-0',
        animate: 'transform scale-100 opacity-100',
        transition: `transition-all duration-${duration} ease-out`,
      },
      flip: {
        initial: 'transform rotateY-90 opacity-0',
        animate: 'transform rotateY-0 opacity-100',
        transition: `transition-all duration-${duration} ease-out`,
      },
      glow: {
        initial: '',
        animate: `shadow-lg shadow-${glowColor}-500/50`,
        transition: `transition-shadow duration-${duration}`,
      },
      float: {
        initial: '',
        animate: 'transform -translate-y-2',
        transition: `transition-transform duration-${duration} ease-in-out`,
      },
    };

    const currentAnimation = animations[animationType];

    const handleMouseEnter = () => {
      if (triggerOnHover) {
        setIsAnimated(true);
      }
    };

    const handleMouseLeave = () => {
      if (triggerOnHover) {
        setIsAnimated(false);
      }
    };

    const handleClick = () => {
      if (triggerOnClick) {
        setIsClicked(true);
        setIsAnimated(!isAnimated);
        setTimeout(() => setIsClicked(false), duration);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          currentAnimation.transition,
          isAnimated ? currentAnimation.animate : currentAnimation.initial,
          isClicked && 'transform scale-95',
          className
        )}
        style={{
          animationDelay: `${delay}ms`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Card>
    );
  }
));

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };