"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, Calendar, Users, Settings, Home, Menu, X, Hotel, CreditCard, TrendingUp } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Guests", href: "/admin/guests", icon: Users },
  { name: "Revenue", href: "/admin/revenue", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <Hotel className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Pacific Reef</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "hotel-gradient text-white",
                    !isActive && "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                  onClick={() => {
                    router.push(item.href)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {item.name}
                </Button>
              )
            })}
          </nav>

          {/* Back to Website */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => {
                router.push("/")
                setIsMobileMenuOpen(false)
              }}
            >
              <Home className="h-4 w-4 mr-3" />
              Back to Website
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
