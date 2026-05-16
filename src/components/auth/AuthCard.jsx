import { useRef, useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import FinancialPanel from './FinancialPanel';

export default function AuthCard({ mousePosRef }) {
  const [view,    setView]    = useState('login');
  const [exiting, setExiting] = useState(false);
  const cardRef = useRef(null);

  const switchView = (target) => {
    if (target === view || exiting) return;
    setExiting(true);
    setTimeout(() => { setView(target); setExiting(false); }, 220);
  };

  const formMap = {
    login:    <LoginForm          onSwitch={switchView} />,
    register: <RegisterForm       onSwitch={switchView} />,
    forgot:   <ForgotPasswordForm onSwitch={switchView} />,
  };

  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-4xl overflow-hidden"
      style={{
        background:           'rgba(8, 12, 28, 0.86)',
        backdropFilter:       'blur(48px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(48px) saturate(1.6)',
        border:               '1px solid rgba(255,255,255,0.11)',
        borderRadius:         '28px',
        boxShadow:            '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.55), rgba(124,58,237,0.55), transparent)' }}
      />

      <div className="flex min-h-[580px]">
        {/* Left — forms */}
        <div className="flex-1 flex flex-col justify-center px-10 py-12 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.35), rgba(124,58,237,0.35))', border: '1px solid rgba(0,212,255,0.3)' }}
            >
              <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span
              className="text-sm font-bold tracking-widest uppercase"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              QuantIA
            </span>
          </div>

          {/* Form */}
          <div className={`transition-all duration-220 ${exiting ? 'auth-form-exit' : ''}`} style={{ minHeight: 380 }}>
            {formMap[view]}
          </div>
        </div>

        {/* Divider */}
        <div
          className="hidden md:block w-px my-10 self-stretch flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.09), transparent)' }}
        />

        {/* Right — financial panel */}
        <div
          className="hidden md:flex flex-1 items-center justify-center min-w-0 overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.12)' }}
        >
          <FinancialPanel mousePosRef={mousePosRef} />
        </div>
      </div>
    </div>
  );
}
