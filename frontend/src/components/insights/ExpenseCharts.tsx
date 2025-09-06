// frontend/src/components/insights/ExpenseCharts.tsx
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, CategoryData as CategoryDataType } from '@/types/expense';
import { CATEGORY_COLORS } from '@/utils/mockData';

export interface CategoryData {
  [key: string]: number | string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

interface ExpenseChartsProps {
  expenses: Expense[];
}

export const ExpenseCharts = ({ expenses }: ExpenseChartsProps) => {
  // Prepare data for charts
  const categoryData: CategoryData[] = Object.entries(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, amount]) => ({
    name: name as any,
    amount,
    percentage: (amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100,
    color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS]
  }));

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === date.getMonth() && 
             expenseDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-medium">
          <p className="font-medium">{`${label}: ₹${payload[0].value.toLocaleString()}`}</p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-muted-foreground">
              {`${payload[0].payload.percentage.toFixed(1)}% of total`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-soft">
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No data available for charts</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                  outerRadius="70%"
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Category Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
