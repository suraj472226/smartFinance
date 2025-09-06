import { Expense, Category } from '@/types/expense';

export const CATEGORIES: Category[] = ['Food', 'Travel', 'Shopping', 'Bills', 'Misc'];

export const CATEGORY_COLORS = {
  Food: '#FF6B6B',
  Travel: '#4ECDC4',
  Shopping: '#45B7D1',
  Bills: '#96CEB4',
  Misc: '#FFEAA7'
};

export const generateMockExpenses = (): Expense[] => {
  const mockExpenses: Expense[] = [
    {
      id: '1',
      amount: 450,
      category: 'Food',
      date: '2024-01-15',
      description: 'Grocery shopping',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      amount: 1200,
      category: 'Bills',
      date: '2024-01-10',
      description: 'Electricity bill',
      createdAt: '2024-01-10T09:00:00Z'
    },
    {
      id: '3',
      amount: 800,
      category: 'Shopping',
      date: '2024-01-12',
      description: 'New shirt',
      createdAt: '2024-01-12T14:20:00Z'
    },
    {
      id: '4',
      amount: 2500,
      category: 'Travel',
      date: '2024-01-08',
      description: 'Flight tickets',
      createdAt: '2024-01-08T16:45:00Z'
    },
    {
      id: '5',
      amount: 300,
      category: 'Food',
      date: '2024-01-14',
      description: 'Restaurant dinner',
      createdAt: '2024-01-14T20:00:00Z'
    }
  ];

  return mockExpenses;
};