
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { storage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { Bell, LogOut, Settings, User, Wallet, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = storage.getUser();

  const handleLogout = () => {
    storage.clearAuth();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border h-16 flex items-center justify-between px-4 sm:px-6 shadow-soft">
      <div className="flex items-center space-x-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary-foreground" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-foreground">ExpenseTracker</h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
            2
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">
                {user?.name || 'User'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
