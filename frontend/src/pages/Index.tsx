// frontend/src/pages/Index.tsx
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { storage } from '@/utils/storage';
import { Wallet, TrendingUp, Camera, BarChart3 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = storage.getAuthToken();
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Track Expenses",
      description: "Monitor your spending with detailed categorization and insights."
    },
    {
      icon: <Camera className="w-8 h-8 text-primary" />,
      title: "Receipt Scanning",
      description: "Upload receipts and extract expense data automatically with OCR."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
      title: "Analytics",
      description: "Visualize your spending patterns with beautiful charts and reports."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-8">
            <Wallet className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Smart Expense Tracking
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take control of your finances with our intelligent expense tracker. 
            Automatically categorize spending, scan receipts, and get insights into your financial habits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow text-center">
              <CardContent className="pt-8 pb-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card rounded-2xl p-8 shadow-medium">
          <h2 className="text-3xl font-bold mb-4">Ready to start tracking?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who have taken control of their finances
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
