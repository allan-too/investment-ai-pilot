
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { AddLandlordDialog } from "@/components/landlords/AddLandlordDialog";
import { LandlordsTable } from "@/components/landlords/LandlordsTable";
import { useLandlords } from "@/hooks/useLandlords";

const Landlords = () => {
  const { user, isAdmin } = useAuth();
  const { landlords, isLoading, fetchLandlords } = useLandlords(isAdmin);

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      window.location.href = '/';
    }
  }, [user, isAdmin]);

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landlord Management</h1>
        <AddLandlordDialog onSuccess={fetchLandlords} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Landlords</CardTitle>
          <CardDescription>
            Manage landlord accounts and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LandlordsTable landlords={landlords} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Landlords;
