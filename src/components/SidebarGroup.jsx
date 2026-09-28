import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { useSidebar } from '../hooks/useSidebar';
import SidebarItem from './SidebarItem';

const SidebarGroup = ({ icon, label, groupKey, children }) => {
  const { isCollapsed, closeMobile } = useSidebar();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const isGroupActive = children.some((c) => c.path === location.pathname);
  const showChildren = open && !isCollapsed;

  const handleClick = () => {
    if (isCollapsed) {
      // collapsed me click → expand sidebar + open group
      // (Context se toggleCollapsed call karenge)
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <li>
      <button
        onClick={handleClick}
        title={isCollapsed ? label : undefined}
        className={`group relative w-full flex items-center rounded-md text-sm font-medium transition-colors
          ${isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between gap-3 px-3 py-2'}
          ${isGroupActive ? 'text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <span className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
          <span className="shrink-0">{icon}</span>
          {!isCollapsed && <span className="truncate">{label}</span>}
        </span>

        {!isCollapsed && (
          <FiChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        )}

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
      </button>

      {/* Children */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          showChildren ? 'max-h-96 mt-1' : 'max-h-0'
        }`}
      >
        <ul className="ml-4 pl-3 border-l border-gray-200 space-y-1">
          {children.map((child) => (
            <li key={child.key}>
              <SidebarItem icon={child.icon} label={child.label} path={child.path} />
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default SidebarGroup;
