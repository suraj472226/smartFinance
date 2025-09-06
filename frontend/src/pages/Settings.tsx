import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { storage } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { User, DollarSign, LogOut, Save } from 'lucide-react';

export const Settings = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    monthlyBudget: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = storage.getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = storage.getUser();
    if (userData) {
      setUser({
        name: userData.name,
        email: userData.email,
        monthlyBudget: userData.monthlyBudget?.toString() || ''
      });
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updatedUser = {
        id: '1',
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget ? parseFloat(user.monthlyBudget) : undefined
      };
      
      storage.saveUser(updatedUser);
      
      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    storage.clearAuth();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Budget Settings */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Budget Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyBudget">Monthly Budget (₹)</Label>
                      <Input
                        id="monthlyBudget"
                        name="monthlyBudget"
                        type="number"
                        value={user.monthlyBudget}
                        onChange={handleInputChange}
                        placeholder="Set your monthly budget limit"
                      />
                      <p className="text-sm text-muted-foreground">
                        Set a monthly budget to get spending alerts and track your progress.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Export Data</h3>
                        <p className="text-sm text-muted-foreground">
                          Download your expense data as CSV
                        </p>
                      </div>
                      <Button variant="outline">
                        Export CSV
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-destructive">Logout</h3>
                        <p className="text-sm text-muted-foreground">
                          Sign out of your account
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};