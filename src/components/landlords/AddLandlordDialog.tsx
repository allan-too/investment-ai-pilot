
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AddLandlordDialogProps = {
  onSuccess: () => void;
};

export const AddLandlordDialog: React.FC<AddLandlordDialogProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newLandlordEmail, setNewLandlordEmail] = useState('');
  const [newLandlordName, setNewLandlordName] = useState('');
  const [newLandlordPassword, setNewLandlordPassword] = useState('');

  const handleAddLandlord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLandlordEmail || !newLandlordName || !newLandlordPassword) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Create new user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: newLandlordEmail,
        password: newLandlordPassword,
        options: {
          data: {
            full_name: newLandlordName,
            role: 'landlord',
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Landlord account created successfully",
      });
      
      setIsOpen(false);
      setNewLandlordEmail('');
      setNewLandlordName('');
      setNewLandlordPassword('');
      
      // Notify parent to refresh landlords list
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create landlord",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Landlord</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Landlord</DialogTitle>
          <DialogDescription>
            Create a new landlord account. They'll receive an email invitation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddLandlord}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newLandlordName}
                onChange={(e) => setNewLandlordName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newLandlordEmail}
                onChange={(e) => setNewLandlordEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newLandlordPassword}
                onChange={(e) => setNewLandlordPassword(e.target.value)}
                placeholder="Set initial password"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Landlord"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
