import { Expense, User } from '@/types/expense';

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  USER: 'user',
  AUTH_TOKEN: 'authToken'
};

export const storage = {
  // Expenses
  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },

  saveExpenses: (expenses: Expense[]): void => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const expenses = storage.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    storage.saveExpenses(expenses);
    return newExpense;
  },

  updateExpense: (id: string, updates: Partial<Expense>): void => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      storage.saveExpenses(expenses);
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = storage.getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    storage.saveExpenses(filtered);
  },

  // User
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Auth
  getAuthToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  saveAuthToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  clearAuth: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};