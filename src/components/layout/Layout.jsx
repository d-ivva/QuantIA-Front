import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex overflow-hidden" style={{ height: '100dvh' }}>
      <Sidebar />
      <main className="q-mesh flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
