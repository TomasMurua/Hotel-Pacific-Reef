"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, DollarSign } from "lucide-react";
import { getRecentBookings } from "@/lib/data-service";

interface RecentBooking {
  bookingId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  revenue: number;
}

export function RecentBookings() {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getRecentBookings(8);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "Active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent bookings</p>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">
                      {booking.roomType}
                    </span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="flex items-center text-xs text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {booking.checkIn} - {booking.checkOut}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ID: {booking.bookingId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-sm font-medium text-green-600">
                    <DollarSign className="h-3 w-3 mr-1" />$
                    {booking.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
