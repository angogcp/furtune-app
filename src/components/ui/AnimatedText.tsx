import { useEffect, useState, memo } from 'react';
import { cn } from '../../utils/cn';

export interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: 'typewriter' | 'fade-in' | 'slide-up' | 'glow' | 'rainbow' | 'wave';
  speed?: number;
  delay?: number;
  loop?: boolean;
  gradient?: boolean;
  glowColor?: string;
}

const AnimatedText = memo<AnimatedTextProps>(({
  text,
  className,
  animationType = 'typewriter',
  speed = 50,
  delay = 0,
  loop = false,
  gradient = false,
  glowColor = 'purple',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const gradientClasses = {
    mystical: 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent',
    cosmic: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent',
    nature: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent',
    fire: 'bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent',
    water: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent',
  };

  const glowClasses = {
    purple: 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    blue: 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]',
    green: 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]',
    red: 'text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]',
    gold: 'text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]',
  };

  useEffect(() => {
    if (animationType === 'typewriter') {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else if (loop) {
          setTimeout(() => {
            setCurrentIndex(0);
            setDisplayText('');
          }, 1000);
        }
      }, delay + speed);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayText(text);
        setIsAnimating(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed, delay, loop, animationType]);

  const getAnimationClasses = () => {
    switch (animationType) {
      case 'fade-in':
        return isAnimating ? 'animate-fade-in' : 'opacity-0';
      case 'slide-up':
        return isAnimating ? 'animate-slide-up' : 'transform translate-y-4 opacity-0';
      case 'glow':
        return `animate-pulse-glow ${glowClasses[glowColor as keyof typeof glowClasses] || glowClasses.purple}`;
      case 'rainbow':
        return 'animate-rainbow-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent';
      case 'wave':
        return 'animate-wave';
      default:
        return '';
    }
  };

  const renderWaveText = () => {
    return text.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block animate-wave"
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const renderRainbowText = () => {
    return text.split('').map((char, index) => {
      const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-blue-500', 'text-indigo-500', 'text-purple-500'];
      const colorClass = colors[index % colors.length];
      
      return (
        <span
          key={index}
          className={cn(
            colorClass,
            'animate-pulse',
            'transition-colors duration-1000'
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const getContent = () => {
    if (animationType === 'wave') {
      return renderWaveText();
    }
    if (animationType === 'rainbow') {
      return renderRainbowText();
    }
    return displayText;
  };

  return (
    <span
      className={cn(
        'transition-all duration-500',
        gradient && gradientClasses.mystical,
        getAnimationClasses(),
        className
      )}
    >
      {getContent()}
      {animationType === 'typewriter' && currentIndex < text.length && (
        <span className="animate-blink">|</span>
      )}
    </span>
  );
});

AnimatedText.displayName = 'AnimatedText';

export { AnimatedText };