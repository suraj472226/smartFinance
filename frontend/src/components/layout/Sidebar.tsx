
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Camera, 
  Home, 
  PlusCircle, 
  Settings, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Add Expense', href: '/add-expense', icon: PlusCircle },
  { name: 'Upload Receipt', href: '/upload-receipt', icon: Camera },
  { name: 'Insights', href: '/insights', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border shadow-soft transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4 lg:mt-8">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={onClose} // Close sidebar on mobile when navigating
                    className={cn(
                      'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};
