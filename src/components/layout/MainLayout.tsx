import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg-main">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={cn(
          'min-h-screen transition-all duration-300 ease-out',
          sidebarCollapsed ? 'ml-20' : 'ml-72'
        )}
        role="main"
      >
        <div className={cn(
          'max-w-7xl mx-auto px-6 py-8',
          'w-full'
        )}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}