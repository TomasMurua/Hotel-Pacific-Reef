"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { fetchHotelData } from "@/lib/data-service"
import type { HotelReservation } from "@/lib/types"

export function AnalyticsCharts() {
  const [data, setData] = useState<HotelReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelData = await fetchHotelData()
        setData(hotelData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Process data for charts
  const monthlyRevenue = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce(
      (acc, curr) => {
        const month = `${curr.arrival_year}-${String(curr.arrival_month).padStart(2, "0")}`
        const revenue = curr.avg_price_per_room * (curr.no_of_weekend_nights + curr.no_of_week_nights)
        acc[month] = (acc[month] || 0) + revenue
        return acc
      },
      {} as Record<string, number>,
    )

  const revenueData = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, revenue]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      revenue: Math.round(revenue),
    }))

  const roomTypeRevenue = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce(
      (acc, curr) => {
        const revenue = curr.avg_price_per_room * (curr.no_of_weekend_nights + curr.no_of_week_nights)
        acc[curr.room_type_reserved] = (acc[curr.room_type_reserved] || 0) + revenue
        return acc
      },
      {} as Record<string, number>,
    )

  const roomRevenueData = Object.entries(roomTypeRevenue).map(([room, revenue]) => ({
    room: room.replace("Room_Type ", "Room "),
    revenue: Math.round(revenue),
  }))

  const marketSegmentData = data.reduce(
    (acc, curr) => {
      acc[curr.market_segment_type] = (acc[curr.market_segment_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const segmentData = Object.entries(marketSegmentData).map(([segment, count]) => ({
    segment,
    count,
  }))

  const leadTimeData = data
    .filter((d) => d.lead_time > 0 && d.lead_time < 365)
    .reduce(
      (acc, curr) => {
        const bucket = Math.floor(curr.lead_time / 30) * 30
        const label = `${bucket}-${bucket + 29} days`
        acc[label] = (acc[label] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const leadTimeChartData = Object.entries(leadTimeData)
    .sort(([a], [b]) => Number.parseInt(a) - Number.parseInt(b))
    .map(([range, count]) => ({
      range,
      count,
    }))

  const COLORS = ["#123332", "#315251", "#FFD9BE", "#64748b", "#334155", "#f8fafc"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#123332" fill="#123332" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Room Type */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="room" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#315251" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Market Segment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Market Segment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lead Time Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Booking Lead Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadTimeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Bookings"]} />
              <Bar dataKey="count" fill="#FFD9BE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
