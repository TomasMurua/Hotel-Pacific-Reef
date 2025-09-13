"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BookingTable } from "@/components/booking-table"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"

function BookingsPageContent() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                <p className="text-gray-600 mt-1">Manage all hotel reservations and guest bookings.</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar View</span>
                </Button>
                <Button className="hotel-gradient text-white flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Booking</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Booking Table */}
          <BookingTable />
        </div>
      </div>
    </div>
  )
}

export default function BookingsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <BookingsPageContent />
    </ProtectedRoute>
  )
}
