import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Category, Expense } from '@/types/expense';
import { Save } from 'lucide-react';
import apiClient from '@/api/apiClient'; // FIX: Using path alias for consistency

const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Misc'];

interface EditExpenseModalProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdate: () => void;
}

export const EditExpenseModal = ({ expense, isOpen, onClose, onExpenseUpdate }: EditExpenseModalProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '' as Category | '',
    date: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Pre-fill form when an expense is selected
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description
      });
    }
  }, [expense]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (value: Category) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    setIsLoading(true);

    try {
      const updatedData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString(),
        description: formData.description
      };
      
      await apiClient.put(`/api/expenses/${expense.id}`, updatedData);

      toast({
        title: 'Expense updated!',
        description: 'Your expense has been successfully updated.',
      });
      onExpenseUpdate(); // Refresh data on the dashboard
      onClose(); // Close the modal

    } catch (error: any) {
        toast({
            title: 'Error Updating Expense',
            description: error.response?.data?.detail || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" name="amount" type="number" step="0.01" value={formData.amount} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange} value={formData.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

