"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"

import { LayoutDashboard, BarChart3, Settings, User, LogOut } from "lucide-react"

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/dashboard",
  },
  {
    label: "Analytics",
    icon: <BarChart3 size={18} />,
    href: "/analytics",
  },
  {
    label: "Profile",
    icon: <User size={18} />,
    href: "/profile",
  },
  {
    label: "Settings",
    icon: <Settings size={18} />,
    href: "/settings",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 px-6 py-4">
        <Link href={"/"} className="text-xl font-semibold tracking-tight text-black">
          Sthira<span className="text-gray-500">Sense</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100 hover:text-black">
                  {item.icon}
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
