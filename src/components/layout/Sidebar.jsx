import { NavLink } from 'react-router-dom';
import {
  Home, ArrowLeftRight, CreditCard, Tag, BarChart2,
  Settings2, Target, Bot, KeyRound, Sun, Moon,
} from 'lucide-react';
import UserProfileMenu from '../profile/UserProfileMenu';
import { useTheme } from '../../contexts/ThemeContext';

const menuItems = [
  { to: '/',                  label: 'Início',           icon: Home,           enabled: true, end: true },
  { to: '/transactions',      label: 'Transações',       icon: ArrowLeftRight, enabled: true },
  { to: '/reports',           label: 'Relatórios',       icon: BarChart2,      enabled: true },
  { to: '/accounts',          label: 'Contas',           icon: CreditCard,     enabled: true },
  { to: '/categories',        label: 'Categorias',       icon: Tag,            enabled: true },
  { to: '/transaction-types', label: 'Tipos',            icon: Settings2,      enabled: true },
  { to: '/monthly-budgets',   label: 'Limite de Gastos', icon: Target,         enabled: true },
];

const aiItems = [
  { to: '/ai-chat',   label: 'Chat QuantIA',  icon: Bot,      enabled: true },
  { to: '/ai-config', label: 'Configurar IA', icon: KeyRound, enabled: true },
];

function NavItem({ item }) {
  if (!item.enabled) {
    return (
      <span className="qs-disabled">
        <item.icon />
        {item.label}
        <span className="qs-badge">Em breve</span>
      </span>
    );
  }
  return (
    <NavLink
      to={item.to}
      end={item.end ?? false}
      className={({ isActive }) => `qs-link${isActive ? ' active' : ''}`}
    >
      <item.icon />
      {item.label}
    </NavLink>
  );
}

/* Logomark — stylised Q with sparkline accent */
function LogoMark() {
  return (
    <div className="qs-mark">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        {/* Circle body */}
        <circle cx="8.5" cy="8.5" r="5.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" fill="none" />
        {/* Magnifier handle */}
        <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="rgba(255,255,255,0.75)" strokeWidth="1.6" strokeLinecap="round" />
        {/* Sparkline inside Q */}
        <polyline
          points="5.5,10 7,7.5 9,9.5 11.5,6.5"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function Sidebar({ isOpen = false }) {
  const { theme, toggle } = useTheme();

  return (
    <aside
      id="main-sidebar"
      className={`qs${isOpen ? ' qs-open' : ''}`}
      aria-label="Menu de navegação"
    >
      {/* Logo */}
      <div className="qs-logo">
        <LogoMark />
        <div className="qs-wordmark">
          <span className="qs-wordmark-name">QuantIA</span>
          <span className="qs-wordmark-tag">Controle Financeiro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="qs-nav" aria-label="Navegação principal">
        <div className="qs-section">
          <p className="qs-section-title">Menu</p>
          {menuItems.map(item => (
            <NavItem key={item.to} item={item} />
          ))}
        </div>

        <div className="qs-sep" role="separator" />

        <div className="qs-section">
          <p className="qs-section-title">QuantIA IA</p>
          {aiItems.map(item => (
            <NavItem key={item.to} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="qs-foot">
        <button
          onClick={toggle}
          className="qs-theme-btn"
          aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
        >
          {theme === 'dark'
            ? <><Sun size={13} /><span>Modo Claro</span></>
            : <><Moon size={13} /><span>Modo Escuro</span></>
          }
        </button>
        <UserProfileMenu />
      </div>
    </aside>
  );
}

export default Sidebar;
