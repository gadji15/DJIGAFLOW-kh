import type React from "react"
import { AdminSidebar } from "./components/admin-sidebar"
import { AdminNavbar } from "./components/admin-navbar"
import { MobileAdminLayout } from "./components/mobile-admin-layout"
import { SupabaseStatus } from "@/components/supabase-status"
import { AdminErrorBoundary } from "./components/error-boundary"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminErrorBoundary>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <div className="w-64 flex-shrink-0">
              <AdminSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminNavbar />
              <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-6 space-y-6">
                  <SupabaseStatus />
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileAdminLayout>
          <SupabaseStatus />
          {children}
        </MobileAdminLayout>
      </div>
    </AdminErrorBoundary>
  )
}
