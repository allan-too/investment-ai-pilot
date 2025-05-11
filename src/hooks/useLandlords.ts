
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
      
      // Ensure data is not null before mapping
      if (data && Array.isArray(data)) {
        const landlordData = data.map(profile => {
          // Find matching user to get email
          const user = usersData?.users.find(u => u.id === profile.id);
          
          // Handle tenant_count safely, ensuring it's always a number
          let tenantCount = 0;
          if (profile.tenant_count && 
              Array.isArray(profile.tenant_count) && 
              profile.tenant_count.length > 0 && 
              typeof profile.tenant_count[0].count === 'number') {
            tenantCount = profile.tenant_count[0].count;
          }
          
          return {
            ...profile,
            email: user?.email || 'Unknown',
            tenant_count: tenantCount
          };
        }) as Landlord[];
        
        setLandlords(landlordData);
      } else {
        // Handle the case where data is null or not an array
        setLandlords([]);
      }
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
