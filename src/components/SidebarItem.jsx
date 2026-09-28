import { NavLink } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

const SidebarItem = ({ icon, label, path, depth = 0 }) => {
  const { isCollapsed, closeMobile } = useSidebar();

  return (
    <NavLink
      to={path}
      onClick={closeMobile}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center rounded-md text-sm transition-colors
        ${isCollapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2'}
        ${
          isActive
            ? 'bg-gray-900 text-white font-medium'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}

      {/* Tooltip when collapsed */}
      {isCollapsed && (
        <span
          className="absolute left-full ml-2 px-2 py-1 text-xs font-medium
            bg-gray-900 text-white rounded whitespace-nowrap
            opacity-0 pointer-events-none group-hover:opacity-100
            transition-opacity duration-150 z-50"
        >
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarItem;
