"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LayoutDashboard, BarChart3, User, LogOut, Activity } from "lucide-react"

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    href: "/dashboard",
  },
  {
    label: "Analytics",
    icon: <BarChart3 size={18} />,
    href: "/dashboard/analytics",
  },
  {
    label: "Risk Analysis",
    icon: <Activity size={18} />,
    href: "/dashboard/chat",
  },
  {
    label: "Profile",
    icon: <User size={18} />,
    href: "/dashboard/profile",
  },
  {
    label: "Logout",
    icon: <LogOut size={18} />,
    href: "/api/logout",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <SidebarHeader className="border-b border-gray-100 px-6 py-4 dark:border-neutral-800">
        <Link
          href={"/"}
          className="text-xl font-semibold tracking-tight text-black dark:text-white"
        >
          Sthira<span className="text-gray-500 dark:text-gray-400">Sense</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link
                  href={item.href}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition ${pathname === item.href ? "bg-chart-1 text-white" : "text-gray-600 hover:bg-gray-50 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
