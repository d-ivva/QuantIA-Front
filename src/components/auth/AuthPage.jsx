import { useEffect, useRef } from 'react';
import AnimatedBackground from './AnimatedBackground';
import AuthCard from './AuthCard';

export default function AuthPage() {
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#020817' }}>
      <AnimatedBackground mousePosRef={mousePosRef} />

      {/* Subtle radial vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,8,23,0.7) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <AuthCard mousePosRef={mousePosRef} />
      </div>
    </div>
  );
}
