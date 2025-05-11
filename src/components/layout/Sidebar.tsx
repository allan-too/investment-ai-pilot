
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  Home, 
  BarChart3, 
  FilePlus, 
  PieChart, 
  Settings, 
  Users, 
  Building,
  CreditCard,
  User,
  Shield,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Sidebar = () => {
  const { isAdmin, isLandlord, isTenant } = useAuth();
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { to: '/', icon: Home, label: 'Dashboard' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ];
    
    if (isAdmin) {
      return [
        ...commonItems,
        { to: '/landlords', icon: Building, label: 'Landlords' },
        { to: '/tenants', icon: Users, label: 'All Tenants' },
        { to: '/properties', icon: Building, label: 'Properties' },
        { to: '/analytics', icon: PieChart, label: 'Analytics' },
        { to: '/admin', icon: Shield, label: 'Admin Panel' },
      ];
    } else if (isLandlord) {
      return [
        ...commonItems,
        { to: '/properties', icon: Building, label: 'Properties' },
        { to: '/tenants', icon: Users, label: 'Tenants' },
        { to: '/upload', icon: FilePlus, label: 'Upload Data' },
        { to: '/analytics', icon: PieChart, label: 'Analytics' },
      ];
    } else if (isTenant) {
      return [
        ...commonItems,
        { to: '/payments', icon: CreditCard, label: 'Payments' },
      ];
    }
    
    // Default menu items if role is not determined yet
    return commonItems;
  };
  
  const menuItems = getMenuItems();

  return (
    <SidebarContainer>
      <SidebarContent>
        <div className="px-3 py-2">
          <h2 className="text-lg font-heading font-bold flex items-center text-realty-blue">
            <span className="bg-realty-blue text-white p-1 rounded mr-2">RI</span>
            RealtyInsight
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "transparent"
                        )
                      }
                      end={item.to === '/'}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            {isLandlord ? (
              <>
                <CreditCard className="h-4 w-4 text-realty-blue" />
                <div className="text-sm">
                  <p className="font-medium">Subscription</p>
                  <p className="text-muted-foreground text-xs">$20 per tenant</p>
                </div>
              </>
            ) : isAdmin ? (
              <>
                <Shield className="h-4 w-4 text-realty-blue" />
                <div className="text-sm">
                  <p className="font-medium">Admin Access</p>
                  <p className="text-muted-foreground text-xs">Full system access</p>
                </div>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-realty-blue" />
                <div className="text-sm">
                  <p className="font-medium">Tenant Portal</p>
                  <p className="text-muted-foreground text-xs">View your rental details</p>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarContent>
    </SidebarContainer>
  );
};
