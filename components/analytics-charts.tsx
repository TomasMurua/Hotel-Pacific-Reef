"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "recharts";
import {
  getMonthlyRevenueData,
  getRoomTypePerformance,
  getGuestDemographics,
} from "@/lib/data-service";

export function AnalyticsCharts() {
  const [monthlyData, setMonthlyData] = useState<
    Array<{ month: string; revenue: number; bookings: number }>
  >([]);
  const [roomTypeData, setRoomTypeData] = useState<
    Array<{
      roomType: string;
      revenue: number;
      bookings: number;
      avgPrice: number;
    }>
  >([]);
  const [demographicsData, setDemographicsData] = useState<{
    marketSegments: Array<{
      segment: string;
      count: number;
      percentage: number;
    }>;
    repeatedGuests: { repeated: number; new: number };
    leadTimeDistribution: Array<{ range: string; count: number }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [monthly, roomType, demographics] = await Promise.all([
          getMonthlyRevenueData(),
          getRoomTypePerformance(),
          getGuestDemographics(),
        ]);

        setMonthlyData(monthly);
        setRoomTypeData(roomType);
        setDemographicsData(demographics);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    );
  }

  if (!demographicsData) return null;

  const COLORS = [
    "#123332",
    "#315251",
    "#FFD9BE",
    "#64748b",
    "#334155",
    "#f8fafc",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Revenue Trend */}
      {/* <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  "Ingresos",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#123332"
                fill="#123332"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Revenue by Room Type */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Ingresos por Tipo de Habitación</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="roomType" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  "Ingresos",
                ]}
              />
              <Bar dataKey="revenue" fill="#315251" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Market Segment Distribution */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Reservas por Segmento de Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographicsData.marketSegments}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ segment, percent }) =>
                  `${segment} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {demographicsData.marketSegments.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Lead Time Distribution */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribución de Tiempo de Anticipación</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographicsData.leadTimeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, "Reservas"]} />
              <Bar dataKey="count" fill="#FFD9BE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
