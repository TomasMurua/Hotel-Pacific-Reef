"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { AdminSidebar } from "@/components/admin-sidebar";
import { DashboardMetrics } from "@/components/dashboard-metrics";
import { AnalyticsCharts } from "@/components/analytics-charts";
import { RecentBookings } from "@/components/recent-bookings";
import { GuestInsights } from "@/components/guest-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Download } from "lucide-react";

function AdminDashboardContent() {
  const quickActions = [
    {
      title: "View All Bookings",
      description: "Manage reservations and check-ins",
      icon: Calendar,
      href: "/admin/bookings",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Guest Management",
      description: "View guest profiles and history",
      icon: Users,
      href: "/admin/guests",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Revenue Analytics",
      description: "Detailed financial reports",
      icon: TrendingUp,
      href: "/admin/analytics",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 lg:ml-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back! Here's what's happening at your hotel.
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="mb-8">
            <DashboardMetrics />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">
                          {action.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4">
                        {action.description}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics Overview
            </h2>
            <AnalyticsCharts />
          </div>

          {/* Recent Bookings and Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentBookings />
            </div>
            <div className="space-y-6">
              <GuestInsights />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Hotel Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Bookings
                      </span>
                      <span className="font-semibold">36,275</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Rooms
                      </span>
                      <span className="font-semibold">38</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Room Types
                      </span>
                      <span className="font-semibold">7</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Data Period
                      </span>
                      <span className="font-semibold">2015-2017</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          30
                        </div>
                        <div className="text-xs text-blue-600">Tourist</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                          8
                        </div>
                        <div className="text-xs text-purple-600">Premium</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "New booking",
                    details: "Room 101 - John Smith",
                    time: "2 minutes ago",
                  },
                  {
                    action: "Check-in completed",
                    details: "Room 205 - Sarah Johnson",
                    time: "15 minutes ago",
                  },
                  {
                    action: "Payment received",
                    details: "$450.00 - Booking #HR-20241201-A1B2",
                    time: "1 hour ago",
                  },
                  {
                    action: "Booking cancelled",
                    details: "Room 301 - Mike Davis",
                    time: "2 hours ago",
                  },
                  {
                    action: "New guest registered",
                    details: "Emily Rodriguez",
                    time: "3 hours ago",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
