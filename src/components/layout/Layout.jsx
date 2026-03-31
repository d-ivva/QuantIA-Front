import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ToastContainer from '../ui/ToastContainer';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}

export default Layout;