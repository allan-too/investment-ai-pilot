
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Landlord } from '@/components/landlords/LandlordsTable';

export const useLandlords = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLandlords = async () => {
    setIsLoading(true);
    try {
      // Join profiles with a count of tenants
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          tenant_count:tenants(count)
        `)
        .eq('role', 'landlord')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Additionally fetch emails from auth.users
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      const landlordData = data?.map(profile => {
        // Find matching user to get email
        const user = usersData?.users.find(u => u.id === profile.id);
        return {
          ...profile,
          email: user?.email || 'Unknown',
          tenant_count: profile.tenant_count?.[0]?.count || 0
        };
      }) as Landlord[];
      
      setLandlords(landlordData || []);
    } catch (error: any) {
      console.error('Error fetching landlords:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load landlords",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchLandlords();
    }
  }, [isAdmin]);

  return {
    landlords,
    isLoading,
    fetchLandlords
  };
};
