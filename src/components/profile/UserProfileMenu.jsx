import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import api from '../../lib/api';
import ProfilePanel from './ProfilePanel';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserProfileMenu() {
  const { userInfo, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [open,    setOpen]    = useState(false);
  const [hovered, setHovered] = useState(false);

  // Fetch profile name from DB (may differ from JWT if user updated it)
  useEffect(() => {
    api.get('/profile').then(res => setProfile(res.data)).catch(() => {});
  }, []);

  const displayName  = profile?.name  ?? userInfo?.name ?? userInfo?.preferred_username ?? 'Usuário';
  const displayEmail = profile?.email ?? userInfo?.email ?? '';
  const initials     = getInitials(displayName);

  return (
    <>
      {/* Clickable user area */}
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-full text-left transition-all duration-200 rounded-xl p-3 group"
        style={{
          background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
          border:     '1px solid transparent',
          ...(hovered ? { borderColor: 'rgba(255,255,255,0.07)' } : {}),
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 relative"
            style={{
              background: 'rgba(0,212,255,0.15)',
              border:     '1px solid rgba(0,212,255,0.25)',
              color:      '#67e8f9',
            }}
          >
            {initials}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border"
              style={{ background: '#22c55e', borderColor: '#111827' }}
            />
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate leading-tight">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
          </div>

          {/* Chevron */}
          <svg
            className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 text-slate-600"
            style={{ transform: hovered ? 'translateX(2px)' : 'none' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-slate-500 hover:text-red-400 hover:bg-white/5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sair
      </button>

      {open && (
        <ProfilePanel
          initialProfile={profile}
          onClose={() => setOpen(false)}
          onProfileUpdate={updated => setProfile(updated)}
        />
      )}
    </>
  );
}
