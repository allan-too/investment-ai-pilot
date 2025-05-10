
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
import { Home, BarChart3, FilePlus, PieChart, Settings, Users } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/properties', icon: BarChart3, label: 'Properties' },
    { to: '/upload', icon: FilePlus, label: 'Upload Data' },
    { to: '/analytics', icon: PieChart, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

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
            <Users className="h-4 w-4 text-realty-blue" />
            <div className="text-sm">
              <p className="font-medium">Team Access</p>
              <p className="text-muted-foreground text-xs">Upgrade for team features</p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </SidebarContainer>
  );
};
