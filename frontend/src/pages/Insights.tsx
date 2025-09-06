import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExpenseCharts } from '@/components/insights/ExpenseCharts';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { storage } from '@/utils/storage';
import { Expense } from '@/types/expense';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

export const Insights = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = storage.getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setExpenses(storage.getExpenses());
  }, [navigate]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const averageExpense = expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Insights</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Detailed analysis of your spending patterns and trends.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <SummaryCard
                title="Total Spent"
                value={`₹${totalExpenses.toLocaleString()}`}
                description="All time"
                icon={<DollarSign className="w-5 h-5" />}
              />
              
              <SummaryCard
                title="Monthly Change"
                value={`${monthlyChange >= 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`}
                description="vs last month"
                icon={monthlyChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                trend={{
                  value: Math.abs(monthlyChange),
                  isPositive: monthlyChange < 0
                }}
              />
              
              <SummaryCard
                title="Average Expense"
                value={`₹${Math.round(averageExpense).toLocaleString()}`}
                description="Per transaction"
                icon={<Calendar className="w-5 h-5" />}
              />
              
              <SummaryCard
                title="Total Transactions"
                value={expenses.length.toString()}
                description="All time"
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>

            <ExpenseCharts expenses={expenses} />
          </div>
        </main>
      </div>
    </div>
  );
};
