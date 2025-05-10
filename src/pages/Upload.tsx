
import React from 'react';
import { FileUploader } from '@/components/upload/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const Upload = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">Upload Property Data</h1>
        <p className="text-muted-foreground mt-1">
          Upload your property data in CSV or Excel format for analysis
        </p>
      </div>
      
      <Alert className="bg-accent/10 border-accent">
        <InfoIcon className="h-4 w-4 text-accent" />
        <AlertTitle>Data Format Instructions</AlertTitle>
        <AlertDescription>
          Your spreadsheet should include columns for address, purchase price, rental income, 
          operating expenses, tenant information, and property value. Download our 
          <a href="#" className="text-accent font-medium hover:underline mx-1">template file</a> 
          for the correct format.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Drag and drop your CSV or Excel file, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium">Data Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Your file will be checked for proper formatting and required fields
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium">Calculation</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll calculate metrics like NOI, Cap Rate, and ROI
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium">Risk Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze tenant scores, neighborhood data, and financial stability
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-medium">Insights Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered recommendations and investment insights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
