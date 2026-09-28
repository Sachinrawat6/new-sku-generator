import { FiTag, FiBox, FiLayers, FiMenu, FiX } from 'react-icons/fi';
import { useSidebar } from '../hooks/useSidebar';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';
import SidebarToggle from './SidebarToggle';

const navItems = [
  {
    key: 'style-numbers',
    label: 'Style Numbers',
    icon: <FiTag className="w-5 h-5" />,
    path: '/style-numbers',
  },
  {
    key: 'products',
    label: 'Products',
    icon: <FiBox className="w-5 h-5" />,
    children: [
      {
        key: 'simple-products',
        label: 'Create Simple Products',
        icon: <FiLayers className="w-4 h-4" />,
        path: '/simple-products',
      },
      {
        key: 'combo-products',
        label: 'Create Combo Products',
        icon: <FiLayers className="w-4 h-4" />,
        path: '/combo-products',
      },
    ],
  },
];

const Sidebar = () => {
  const { isCollapsed, isMobileOpen, toggleMobile, closeMobile } = useSidebar();
  const width = isCollapsed ? 'w-[72px]' : 'w-64';

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div onClick={closeMobile} className="lg:hidden fixed inset-0 bg-black/40 z-30" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen ${width} bg-white border-r border-gray-200 z-40
          flex flex-col transition-all duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 overflow-hidden">
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-gray-900 tracking-tight truncate">
              SKU CREATOR
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {!isCollapsed && (
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Menu
            </p>
          )}

          <ul className="space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <SidebarGroup
                  key={item.key}
                  groupKey={item.key}
                  label={item.label}
                  icon={item.icon}
                  children={item.children}
                />
              ) : (
                <li key={item.key}>
                  <SidebarItem icon={item.icon} label={item.label} path={item.path} />
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-400 text-center truncate">
            {isCollapsed ? '©' : '© 2025 StyleHub'}
          </p>
        </div>
      </aside>

      {/* Floating edge toggle (desktop only) */}
      <SidebarToggle />
    </>
  );
};

export default Sidebar;
