// frontend/src/pages/UploadReceipt.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ReceiptUpload } from '../components/upload/ReceiptUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import apiClient from '../api/apiClient';
import { Save, RefreshCw } from 'lucide-react';

export const UploadReceipt = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtractedData({
          ...extractedData,
          [e.target.name]: e.target.value
      })
  }

  const handleSaveExpense = async () => {
    if (!extractedData) return;
    setIsLoading(true);

    try {
        const expenseData = {
            amount: parseFloat(extractedData.amount),
            category: extractedData.category,
            date: new Date(extractedData.date).toISOString(),
            description: extractedData.description
        };
        await apiClient.post('/api/expenses/', expenseData);
        toast({
            title: 'Expense Saved!',
            description: 'The scanned expense has been added to your records.',
        });
        navigate('/dashboard');
    } catch(error: any) {
        toast({
            title: 'Failed to Save',
            description: error.response?.data?.detail || 'Could not save the expense.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Upload Receipt</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {!extractedData ? (
                <div className="md:col-span-2">
                    <ReceiptUpload onUploadSuccess={setExtractedData} />
                </div>
              ) : (
                <>
                    <div>
                        <Card className="shadow-medium">
                            <CardHeader>
                                <CardTitle>Extracted Details</CardTitle>
                                <CardDescription>Review and edit the data scanned from your receipt.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input name="amount" value={extractedData.amount.toFixed(2)} onChange={handleDataChange}/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Category (Suggested)</Label>
                                    <Input name="category" value={extractedData.category} onChange={handleDataChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input name="description" value={extractedData.description} onChange={handleDataChange}/>
                                </div>
                                <div className="flex space-x-2">
                                    <Button onClick={handleSaveExpense} disabled={isLoading} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {isLoading ? 'Saving...' : 'Save as Expense'}
                                    </Button>
                                    <Button variant="outline" onClick={() => setExtractedData(null)}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Scan New
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {/* --- NEW DEBUGGING VIEW --- */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw OCR Text</CardTitle>
                                <CardDescription>This is the raw text extracted by the AI.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-md h-64 overflow-y-auto">
                                    {extractedData.extracted_text || "No raw text available."}
                                </pre>
                            </CardContent>
                        </Card>
                    </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};