
import React, { useState, useEffect } from 'react';
import { PropertyCard, PropertyData } from '@/components/dashboard/PropertyCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Properties = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockProperties = [
        {
          id: "1", // Changed from number to string to match PropertyData type
          address: '123 Main Street, New York, NY 10001',
          riskScore: 25,
          roi: 12.5,
          noi: 45000,
          capRate: 5.8,
          createdAt: '2023-03-15T12:00:00Z',
        },
        {
          id: "2", // Changed from number to string
          address: '456 Park Avenue, Chicago, IL 60601',
          riskScore: 48,
          roi: 8.2,
          noi: 68000,
          capRate: 4.9,
          createdAt: '2023-04-22T15:30:00Z',
        },
        {
          id: "3", // Changed from number to string
          address: '789 Oak Drive, Los Angeles, CA 90001',
          riskScore: 72,
          roi: 5.1,
          noi: 32000,
          capRate: 3.2,
          createdAt: '2023-05-10T09:15:00Z',
        },
        {
          id: "4", // Changed from number to string
          address: '321 Pine Street, Seattle, WA 98101',
          riskScore: 35,
          roi: 9.7,
          noi: 51000,
          capRate: 4.5,
          createdAt: '2023-02-05T10:20:00Z',
        },
        {
          id: "5", // Changed from number to string
          address: '555 Maple Avenue, Boston, MA 02108',
          riskScore: 62,
          roi: 7.3,
          noi: 42000,
          capRate: 3.8,
          createdAt: '2023-01-18T14:45:00Z',
        },
        {
          id: "6", // Changed from number to string
          address: '777 Cedar Boulevard, Miami, FL 33101',
          riskScore: 19,
          roi: 14.2,
          noi: 75000,
          capRate: 6.1,
          createdAt: '2023-06-02T08:30:00Z',
        },
      ];
      
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedProperties = () => {
    let filtered = properties;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort properties
    switch (sortBy) {
      case 'risk':
        return [...filtered].sort((a, b) => a.riskScore - b.riskScore);
      case 'roi':
        return [...filtered].sort((a, b) => b.roi - a.roi);
      case 'noi':
        return [...filtered].sort((a, b) => b.noi - a.noi);
      case 'caprate':
        return [...filtered].sort((a, b) => b.capRate - a.capRate);
      case 'date':
      default:
        return [...filtered].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const displayedProperties = filteredAndSortedProperties();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">Properties</h1>
        <Button onClick={() => navigate('/upload')}>
          <Plus className="h-4 w-4 mr-1" />
          Add Property
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search properties..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (Newest)</SelectItem>
              <SelectItem value="risk">Risk (Low to High)</SelectItem>
              <SelectItem value="roi">ROI (High to Low)</SelectItem>
              <SelectItem value="noi">NOI (High to Low)</SelectItem>
              <SelectItem value="caprate">Cap Rate (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          {displayedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try a different search term.' : 'Upload data to add properties.'}
              </p>
              <Button onClick={() => navigate('/upload')}>Upload Property Data</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
