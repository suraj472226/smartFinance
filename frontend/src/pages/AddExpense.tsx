// frontend/src/pages/AddExpense.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { storage } from '@/utils/storage';

export const AddExpense = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = storage.getAuthToken();
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className="flex-1">
          <ExpenseForm />
        </main>
      </div>
    </div>
  );
};
