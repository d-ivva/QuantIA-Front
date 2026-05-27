import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { tokenStore } from './tokenStore';
import AuthPage from '../components/auth/AuthPage';

const AuthContext = createContext(null);

function InitializingScreen() {
  return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#020817' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(0,212,255,0.25)', borderTopColor: '#00d4ff' }}
        />
        <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(0,212,255,0.45)' }}>
          Verificando sessão
        </p>
      </div>
    </div>
  );
}

export function AuthProvider({ children }) {
  const [initialized,   setInitialized]   = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    // Só roda uma vez: valida o token que está no sessionStorage
    if (mounted.current) return;
    mounted.current = true;

    tokenStore.validate().then((valid) => {
      setAuthenticated(valid);
      setInitialized(true);
    });
  }, []);

  if (!initialized)   return <InitializingScreen />;
  if (!authenticated) return <AuthPage />;

  return (
    <AuthContext.Provider
      value={{
        token:    tokenStore.token,
        userInfo: tokenStore.userInfo,
        logout:   () => tokenStore.logout(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
