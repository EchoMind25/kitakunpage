"use client";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { Toast } from "./ui/Toast";
import { useAdminStore } from "@/store/adminStore";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAdminStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      <AdminSidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "md:ml-[280px]" : ""
        }`}
      >
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toast />
    </div>
  );
}
