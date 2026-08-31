import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Settings, Bike, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/months', label: 'Months', icon: CalendarDays },
  { path: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();
  
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-bg-sidebar border-r border-border-subtle',
        'transition-all duration-300 ease-out',
        'flex flex-col',
        collapsed ? 'w-20' : 'w-72'
      )}
      aria-label="Main navigation"
    >
      {/* Logo / Brand */}
      <div className={cn(
        'flex items-center justify-between h-16 px-4 border-b border-border-subtle',
        'transition-all duration-300 ease-out'
      )}>
        {!collapsed && (
          <NavLink
            to="/"
            className="flex items-center gap-3 text-text-primary font-semibold text-heading-4"
            aria-label="Fiets Dashboard Home"
          >
            <Bike className="h-6 w-6 text-accent-green" aria-hidden="true" />
            <span className="whitespace-nowrap">Fiets Dashboard</span>
          </NavLink>
        )}
        {collapsed && (
          <NavLink
            to="/"
            className="flex items-center justify-center text-text-primary"
            aria-label="Fiets Dashboard Home"
          >
            <Bike className="h-6 w-6 text-accent-green" aria-hidden="true" />
          </NavLink>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card',
            'transition-colors duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green',
            collapsed && 'ml-auto'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin" aria-label="Navigation">
        <ul className="space-y-1" role="list">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: active }) => cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                    'transition-all duration-200 ease-out',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-sidebar',
                    active
                      ? 'bg-bg-card-hover text-text-primary border border-border-muted shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-accent-green')} aria-hidden="true" />
                  {!collapsed && <span className="font-medium text-body">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={cn(
        'p-3 border-t border-border-subtle',
        'transition-all duration-300 ease-out',
        collapsed && 'hidden'
      )}>
        <p className="text-caption text-text-muted text-center">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}