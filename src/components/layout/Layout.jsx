import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  /* Fecha o drawer automaticamente ao navegar */
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  /* Bloqueia scroll do body enquanto drawer está aberto */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex overflow-hidden" style={{ height: '100dvh' }}>

      {/* Backdrop — fecha ao clicar fora (mobile/tablet) */}
      {sidebarOpen && (
        <div
          className="qs-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — recebe classe qs-open para o drawer no mobile */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Coluna de conteúdo */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>

        {/* Topbar — só visível em mobile/tablet via CSS */}
        <header className="qs-topbar" role="banner">
          <button
            className="qs-hamburger"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={sidebarOpen}
            aria-controls="main-sidebar"
          >
            {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
          <span className="qs-topbar-logo">QuantIA</span>
        </header>

        {/* Área de conteúdo principal */}
        <main className="q-mesh flex-1 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default Layout;
