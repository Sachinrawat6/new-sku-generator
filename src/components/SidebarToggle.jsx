import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSidebar } from '../hooks/useSidebar';

const SidebarToggle = () => {
  const { isCollapsed, toggleCollapsed } = useSidebar();

  return (
    <button
      onClick={toggleCollapsed}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={`${isCollapsed ? 'Expand' : 'Collapse'} (Ctrl+B)`}
      className={`hidden lg:flex fixed top-20 z-50 w-6 h-6 items-center justify-center
        bg-white border border-gray-200 rounded-full text-gray-500
        hover:text-gray-900 hover:border-gray-900
        transition-all duration-300
        ${isCollapsed ? 'left-[68px]' : 'left-[244px]'}`}
    >
      {isCollapsed ? (
        <FiChevronRight className="w-3.5 h-3.5" />
      ) : (
        <FiChevronLeft className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

export default SidebarToggle;
