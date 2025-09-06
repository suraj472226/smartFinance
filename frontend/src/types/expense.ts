export interface Expense {
  id: string; // MongoDB _id comes as 'id'
  amount: number;
  category: Category;
  date: string; // ISO string format
  description: string;
  owner_id: string;
}

export type Category = 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Misc';

// This matches the response from /api/insights/summary
export interface DashboardSummary {
  total_expenses: number;
  month_expenses: number;
  transaction_count: number;
}

// This matches the response from /api/insights/by-category
export type CategoryData = Record<string, number>;

export interface User {
  id: string;
  email: string;
}
