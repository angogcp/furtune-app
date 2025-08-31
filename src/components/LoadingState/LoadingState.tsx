import { memo } from 'react';
import { Loading } from '../ui/Loading';
import { ParticleEffect } from '../ui/ParticleEffect';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showParticles?: boolean;
}

export const LoadingState = memo<LoadingStateProps>(({
  message = '正在为您占卜...',
  submessage = '请稍候，神秘的力量正在为您揭示答案',
  size = 'lg',
  showParticles = true
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {showParticles && (
        <ParticleEffect 
          particleCount={30}
          theme="mystical"
          speed={0.5}
          interactive
          className="absolute inset-0 pointer-events-none"
        />
      )}
      <div className="text-center py-16 relative z-10">
        <Loading size={size} className="mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">{message}</h2>
        <p className="text-slate-300">{submessage}</p>
      </div>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';