import { NavLink } from 'react-router-dom';
import { Wallet, ArrowLeftRight, CreditCard, Tag, BarChart2 } from 'lucide-react';

const menuItems = [
  { to: '/transactions', label: 'Transações', icon: ArrowLeftRight, enabled: true },
  { to: '/contas',    label: 'Contas',      icon: CreditCard,     enabled: false },
  { to: '/categorias',label: 'Categorias',  icon: Tag,            enabled: false },
  { to: '/relatorios',label: 'Relatórios',  icon: BarChart2,      enabled: false },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">QuantIA</h1>
            <p className="text-xs text-gray-400">Controle de Gastos</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              {item.enabled ? (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ) : (
                <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 cursor-not-allowed">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  <span className="ml-auto text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
                    Em breve
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">Desenv. Sistemas Web</p>
        <p className="text-xs text-gray-600">Prof. Matheus Cataneo</p>
      </div>
    </aside>
  );
}

export default Sidebar;