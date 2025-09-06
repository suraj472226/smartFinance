// frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { Expense, DashboardSummary } from '@/types/expense';
import { Calendar, DollarSign, Activity, Hash } from 'lucide-react';
import apiClient from '../api/apiClient';
import { Skeleton } from '@/components/ui/skeleton';

export const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      // Fetch both summary and expenses in parallel
      const [summaryRes, expensesRes] = await Promise.all([
        apiClient.get('/api/insights/summary'),
        apiClient.get('/api/expenses/')
      ]);
      setSummary(summaryRes.data);
      setExpenses(expensesRes.data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      if (error.response?.status === 401) {
        navigate('/login'); // Redirect if not authorized
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleExpenseUpdate = () => {
    // Refetch all data when an expense is changed
    fetchData();
  };
  
  const SummarySkeleton = () => (
    <>
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Welcome back! Here's your expense overview.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {isLoading || !summary ? <SummarySkeleton/> : (
                    <>
                        <SummaryCard
                            title="This Month"
                            value={`₹${summary.month_expenses.toLocaleString()}`}
                            description="Total spent this month"
                            icon={<DollarSign className="w-5 h-5" />}
                        />
                        <SummaryCard
                            title="Total Expenses"
                            value={`₹${summary.total_expenses.toLocaleString()}`}
                            description="All-time spending"
                            icon={<Activity className="w-5 h-5" />}
                        />
                        <SummaryCard
                            title="Transactions"
                            value={summary.transaction_count.toString()}
                            description="Total transactions recorded"
                            icon={<Hash className="w-5 h-5" />}
                        />
                        <SummaryCard
                            title="Daily Average"
                            value={`₹${(summary.month_expenses / new Date().getDate()).toFixed(2)}`}
                            description="This month"
                            icon={<Calendar className="w-5 h-5" />}
                        />
                    </>
                )}
            </div>

            {isLoading ? <Skeleton className="h-64 w-full" /> : <ExpenseList expenses={expenses} onExpenseUpdate={handleExpenseUpdate} />}
          </div>
        </main>
      </div>
    </div>
  );
};

