// frontend/src/components/expenses/ExpenseForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Category } from '@/types/expense';
import { ArrowLeft, Save } from 'lucide-react';
import apiClient from '../../api/apiClient';

const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Misc'];

export const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '' as Category | '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCategoryChange = (value: Category) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.category) {
      toast({
        title: 'Error',
        description: 'Please select a category.',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(), // Send as full ISO string
        description: formData.description
      };
      
      await apiClient.post('/api/expenses/', expenseData);

      toast({
        title: 'Expense added!',
        description: `₹${expenseData.amount} expense has been recorded.`,
      });

      navigate('/dashboard');

    } catch (error: any) {
        toast({
            title: 'Error Saving Expense',
            description: error.response?.data?.detail || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add New Expense</h1>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={handleCategoryChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter expense description..."
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

