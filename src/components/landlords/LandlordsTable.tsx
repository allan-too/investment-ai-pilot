
import React from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Landlord = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: string;
  tenant_count: number;
};

type LandlordsTableProps = {
  landlords: Landlord[];
  isLoading: boolean;
};

export const LandlordsTable: React.FC<LandlordsTableProps> = ({ landlords, isLoading }) => {
  const { toast } = useToast();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tenants</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            </TableCell>
          </TableRow>
        ) : landlords.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              No landlords found
            </TableCell>
          </TableRow>
        ) : (
          landlords.map((landlord) => (
            <TableRow key={landlord.id}>
              <TableCell className="font-medium">{landlord.full_name || 'Unnamed'}</TableCell>
              <TableCell>{landlord.email}</TableCell>
              <TableCell>{landlord.tenant_count}</TableCell>
              <TableCell>{format(new Date(landlord.created_at), 'PPP')}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Navigate to landlord details or subscription management
                    // This would be implemented in a real application
                    toast({
                      title: "Not implemented",
                      description: "Landlord details view would go here",
                    });
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
