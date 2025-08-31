import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface ParticleEffectProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: { min: number; max: number };
  opacity?: { min: number; max: number };
  life?: { min: number; max: number };
  interactive?: boolean;
  theme?: 'mystical' | 'cosmic' | 'nature' | 'fire' | 'water';
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  className,
  particleCount = 50,
  colors = ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE'],
  speed = 1,
  size = { min: 1, max: 3 },
  opacity = { min: 0.3, max: 0.8 },
  life = { min: 3000, max: 6000 },
  interactive = true,
  theme = 'mystical',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [_particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const themeColors = {
    mystical: ['#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'],
    cosmic: ['#1E293B', '#334155', '#475569', '#64748B', '#94A3B8'],
    nature: ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'],
    fire: ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#FDE047'],
    water: ['#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63'],
  };

  const currentColors = themeColors[theme] || colors;

  const createParticle = (x?: number, y?: number): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return {} as Particle;

    const particleLife = life.min + Math.random() * (life.max - life.min);
    
    return {
      id: Math.random(),
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: size.min + Math.random() * (size.max - size.min),
      opacity: opacity.min + Math.random() * (opacity.max - opacity.min),
      color: currentColors[Math.floor(Math.random() * currentColors.length)],
      life: particleLife,
      maxLife: particleLife,
    };
  };

  const updateParticle = (particle: Particle): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return particle;

    let newX = particle.x + particle.vx;
    let newY = particle.y + particle.vy;
    let newVx = particle.vx;
    let newVy = particle.vy;

    // 边界反弹
    if (newX <= 0 || newX >= canvas.width) {
      newVx = -newVx;
      newX = Math.max(0, Math.min(canvas.width, newX));
    }
    if (newY <= 0 || newY >= canvas.height) {
      newVy = -newVy;
      newY = Math.max(0, Math.min(canvas.height, newY));
    }

    // 鼠标交互
    if (interactive) {
      const dx = mousePos.x - newX;
      const dy = mousePos.y - newY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        newVx += (dx / distance) * force * 0.1;
        newVy += (dy / distance) * force * 0.1;
      }
    }

    const newLife = particle.life - 16; // 假设60fps
    const lifeRatio = newLife / particle.maxLife;
    
    return {
      ...particle,
      x: newX,
      y: newY,
      vx: newVx * 0.99, // 阻力
      vy: newVy * 0.99,
      life: newLife,
      opacity: particle.opacity * lifeRatio,
    };
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    // 添加发光效果
    ctx.shadowBlur = particle.size * 2;
    ctx.shadowColor = particle.color;
    ctx.fill();
    
    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setParticles(prevParticles => {
      let newParticles = prevParticles
        .map(updateParticle)
        .filter(particle => particle.life > 0);

      // 补充粒子
      while (newParticles.length < particleCount) {
        newParticles.push(createParticle());
      }

      // 绘制粒子
      newParticles.forEach(particle => drawParticle(ctx, particle));

      return newParticles;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 在点击位置创建多个粒子
    setParticles(prev => [
      ...prev,
      ...Array.from({ length: 10 }, () => createParticle(x, y))
    ]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化粒子
    const initialParticles = Array.from({ length: particleCount }, () => createParticle());
    setParticles(initialParticles);

    // 开始动画
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, theme]);

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          'w-full h-full',
          interactive && 'pointer-events-auto cursor-pointer'
        )}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
    </div>
  );
};

export { ParticleEffect };