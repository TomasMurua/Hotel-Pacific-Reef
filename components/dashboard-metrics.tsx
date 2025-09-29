"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign, Percent } from "lucide-react"
import { getDashboardMetrics } from "@/lib/data-service"
import type { DashboardMetricsType } from "@/lib/types"

export function DashboardMetricsComponent() {
  const [metrics, setMetrics] = useState<DashboardMetricsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const metricCards = [
    {
      title: "Occupancy Rate",
      value: `${metrics.occupancyRate.toFixed(1)}%`,
      icon: Users,
      trend: metrics.occupancyRate > 75 ? "up" : "down",
      trendValue: "vs last month",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Average Daily Rate",
      value: `$${metrics.adr}`,
      icon: DollarSign,
      trend: "up",
      trendValue: "+5.2% vs last month",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Revenue Per Room",
      value: `$${metrics.revpar}`,
      icon: TrendingUp,
      trend: "up",
      trendValue: "+3.1% vs last month",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Cancellation Rate",
      value: `${metrics.cancellationRate.toFixed(1)}%`,
      icon: Percent,
      trend: metrics.cancellationRate < 10 ? "down" : "up",
      trendValue: "vs last month",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => {
        const IconComponent = metric.icon
        const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                <TrendIcon className={`h-3 w-3 mr-1 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                <span>{metric.trendValue}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export { DashboardMetricsComponent as DashboardMetrics }
