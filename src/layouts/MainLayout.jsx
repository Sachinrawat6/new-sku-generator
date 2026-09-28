import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../hooks/useSidebar';

const MainLayout = () => {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  // Keyboard shortcut: Ctrl/Cmd + B
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={`min-h-screen transition-all duration-300 ${
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
