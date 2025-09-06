// frontend/src/components/upload/ReceiptUpload.tsx

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileImage, X, Loader2 } from 'lucide-react';
import apiClient from '../../api/apiClient'; // Correct relative path

interface ReceiptUploadProps {
  onUploadSuccess: (data: any) => void;
}

export const ReceiptUpload = ({ onUploadSuccess }: ReceiptUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // REAL API CALL: Replaces the mock setTimeout
      const response = await apiClient.post('/api/upload/receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Receipt Scanned!',
        description: 'Expense details have been extracted.',
      });
      onUploadSuccess(response.data); // Pass data to the parent page
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.detail || 'Could not process the receipt.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
      setSelectedFile(null);
      setPreview(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Card className="shadow-medium">
      <CardContent className="p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          ref={fileInputRef}
        />
        {!preview ? (
            <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Click to upload a receipt</h3>
                <p className="text-sm text-muted-foreground">PNG, JPG, or GIF</p>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                    <img src={preview} alt="Receipt preview" className="w-full h-full object-contain" />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80" onClick={clearSelection}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={handleUpload} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileImage className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Scanning...' : 'Scan Receipt'}
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};