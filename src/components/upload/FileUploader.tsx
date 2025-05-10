
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    setUploadSuccess(false);

    const selectedFile = acceptedFiles[0];
    
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(selectedFile.type)) {
      setUploadError('Invalid file format. Please upload a CSV or Excel file.');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum file size is 10MB.');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setUploadSuccess(true);
            toast({
              title: "File uploaded successfully",
              description: "Your data is being processed",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    // In a real app, this would be an API call
    // try {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   
    //   const response = await fetch('/api/uploads', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //   
    //   if (!response.ok) {
    //     throw new Error('Upload failed');
    //   }
    //   
    //   const data = await response.json();
    //   setUploadSuccess(true);
    // } catch (error) {
    //   setUploadError('Failed to upload file. Please try again.');
    //   setUploading(false);
    // }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return (
    <div className="space-y-6">
      <div 
        {...getRootProps()} 
        className={`file-drop-zone ${isDragActive ? 'active' : ''} ${file ? 'border-green-500/50 bg-green-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Drag and drop your file here</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Supports CSV and Excel files (XLSX, XLS)
            </p>
            <Button variant="outline" className="mt-4">
              Browse Files
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <File className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-lg font-medium">{file.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button variant="outline" className="mt-4" onClick={(e) => {
              e.stopPropagation();
              resetUpload();
            }}>
              Change File
            </Button>
          </div>
        )}
      </div>

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      {file && !uploadSuccess && !uploading && (
        <Button onClick={handleUpload} className="w-full">
          Upload File
        </Button>
      )}
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      {uploadSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-800">
            File uploaded successfully! Your data is being processed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
