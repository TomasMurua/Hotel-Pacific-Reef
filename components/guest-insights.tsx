"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Repeat, Clock, TrendingUp } from "lucide-react";
import { getGuestDemographics } from "@/lib/data-service";

interface GuestInsightsData {
  marketSegments: Array<{ segment: string; count: number; percentage: number }>;
  repeatedGuests: { repeated: number; new: number };
  leadTimeDistribution: Array<{ range: string; count: number }>;
}

export function GuestInsights() {
  const [data, setData] = useState<GuestInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demographics = await getGuestDemographics();
        setData(demographics);
      } catch (error) {
        console.error("Error fetching guest insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Guest Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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

  if (!data) return null;

  const totalGuests = data.repeatedGuests.repeated + data.repeatedGuests.new;
  const repeatGuestPercentage =
    totalGuests > 0
      ? Math.round((data.repeatedGuests.repeated / totalGuests) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Guest Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Repeated vs New Guests */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Repeat className="h-4 w-4 mr-1" />
              Returning vs New Guests
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  {data.repeatedGuests.repeated.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">Returning</div>
                <div className="text-xs text-gray-500">
                  {repeatGuestPercentage}% of total
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {data.repeatedGuests.new.toLocaleString()}
                </div>
                <div className="text-xs text-blue-600">New</div>
                <div className="text-xs text-gray-500">
                  {100 - repeatGuestPercentage}% of total
                </div>
              </div>
            </div>
          </div>

          {/* Top Market Segments */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Top Market Segments
            </h4>
            <div className="space-y-2">
              {data.marketSegments
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((segment, index) => (
                  <div
                    key={segment.segment}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <span className="text-sm text-gray-600">
                        {segment.segment}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {segment.percentage}%
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {segment.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Lead Time Insights */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Lead Time
            </h4>
            <div className="space-y-2">
              {data.leadTimeDistribution
                .sort((a, b) => {
                  // Custom sort order for lead time ranges
                  const order = [
                    "0-7 days",
                    "8-30 days",
                    "31-90 days",
                    "91+ days",
                  ];
                  return order.indexOf(a.range) - order.indexOf(b.range);
                })
                .map((item, index) => {
                  const total = data.leadTimeDistribution.reduce(
                    (sum, d) => sum + d.count,
                    0
                  );
                  const percentage =
                    total > 0 ? Math.round((item.count / total) * 100) : 0;

                  return (
                    <div
                      key={item.range}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-600">
                        {item.range}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
