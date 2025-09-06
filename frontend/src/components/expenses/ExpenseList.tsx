import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Expense, Category } from '@/types/expense';
import { Edit, Trash2, Filter } from 'lucide-react';
import apiClient from '../../api/apiClient'; // FIX: Changed to relative path
import { EditExpenseModal } from './EditExpenseModal'; // Import the new modal

const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Misc'];
const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#F59E0B',
  Travel: '#3B82F6',
  Shopping: '#8B5CF6',
  Bills: '#EF4444',
  Misc: '#6B7280',
};

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseUpdate: () => void;
}

export const ExpenseList = ({ expenses, onExpenseUpdate }: ExpenseListProps) => {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredExpenses = expenses.filter(expense => 
    categoryFilter === 'all' || expense.category === categoryFilter
  );

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
        return;
    }
    try {
        await apiClient.delete(`/api/expenses/${id}`);
        toast({
            title: 'Expense deleted',
            description: 'The expense has been successfully deleted.',
        });
        onExpenseUpdate(); // Trigger data refetch in parent
    } catch (error: any) {
        toast({
            title: 'Error Deleting Expense',
            description: error.response?.data?.detail || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    }
  };

  const getCategoryColor = (category: Category) => {
    return CATEGORY_COLORS[category] || '#6B7280';
  };

  if (expenses.length === 0) {
    return (
      <Card className="shadow-soft">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <h3 className="text-lg font-medium mb-2">No expenses yet</h3>
            <p className="text-sm">Start by adding your first expense!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Recent Expenses
            </CardTitle>
            <Select onValueChange={(value) => setCategoryFilter(value as Category | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" style={{ backgroundColor: `${getCategoryColor(expense.category)}20`, color: getCategoryColor(expense.category) }}>
                        {expense.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold">₹{expense.amount.toLocaleString()}</span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(expense)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(expense.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <EditExpenseModal
        expense={selectedExpense}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseUpdate={onExpenseUpdate}
      />
    </>
  );
};

