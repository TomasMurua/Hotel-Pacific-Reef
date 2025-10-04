import type { HotelReservation, RoomType, DashboardMetrics } from "./types";
import { createClient } from "@/utils/supabase/client";

let cachedData: HotelReservation[] | null = null;

export async function fetchHotelData(): Promise<HotelReservation[]> {
  if (cachedData) return cachedData;

  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("hotel_pacific_reef")
      .select("*");

    if (error) {
      console.error("Error fetching hotel data from Supabase:", error);
      return [];
    }

    // Transform the data to match our interface
    const transformedData: HotelReservation[] = data.map((row: any) => ({
      Booking_ID: row.Booking_ID || "",
      no_of_adults: Number(row.no_of_adults) || 0,
      no_of_children: Number(row.no_of_children) || 0,
      no_of_weekend_nights: Number(row.no_of_weekend_nights) || 0,
      no_of_week_nights: Number(row.no_of_week_nights) || 0,
      type_of_meal_plan: row.type_of_meal_plan || "",
      required_car_parking_space: Number(row.required_car_parking_space) || 0,
      room_type_reserved: row.room_type_reserved || "",
      lead_time: Number(row.lead_time) || 0,
      arrival_year: Number(row.arrival_year) || 0,
      arrival_month: Number(row.arrival_month) || 0,
      arrival_date: Number(row.arrival_date) || 0,
      market_segment_type: row.market_segment_type || "",
      repeated_guest: Number(row.repeated_guest) || 0,
      no_of_previous_cancellations:
        Number(row.no_of_previous_cancellations) || 0,
      no_of_previous_bookings_not_canceled:
        Number(row.no_of_previous_bookings_not_canceled) || 0,
      avg_price_per_room: Number(row.avg_price_per_room) || 0,
      no_of_special_requests: Number(row.no_of_special_requests) || 0,
      booking_status: row.booking_status || "",
    }));

    cachedData = transformedData;
    return transformedData;
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    return [];
  }
}

export async function getRoomTypes(): Promise<RoomType[]> {
  const data = await fetchHotelData();
  const uniqueRoomTypes = [...new Set(data.map((d) => d.room_type_reserved))];

  return uniqueRoomTypes.map((roomType, index) => {
    const roomData = data.filter((d) => d.room_type_reserved === roomType);
    const avgPrice =
      roomData.reduce((sum, r) => sum + r.avg_price_per_room, 0) /
      roomData.length;
    const maxAdults = Math.max(...roomData.map((r) => r.no_of_adults));
    const maxChildren = Math.max(...roomData.map((r) => r.no_of_children));

    const availableImages = ["/room1.jpg", "/room2.jpg", "/room3.jpg"] as const;
    const primaryIndex = index % availableImages.length;
    const images = [
      availableImages[primaryIndex],
      ...availableImages.filter((_, i) => i !== primaryIndex),
    ];

    const displayName = roomType.replace(/^Room_Type\s*/, "Room ");

    return {
      id: `room-${index + 1}`,
      name: displayName,
      capacity: {
        adults: maxAdults || 2,
        children: maxChildren || 2,
      },
      price: Math.round(avgPrice),
      amenities: ["WiFi", "Air Conditioning", "Room Service", "TV"],
      images,
      description: `Comfortable ${roomType.toLowerCase()} with modern amenities and elegant design.`,
    };
  });
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const data = await fetchHotelData();

  const totalBookings = data.length;
  const canceledBookings = data.filter(
    (d) => d.booking_status === "Canceled"
  ).length;
  const checkedOutBookings = data.filter(
    (d) => d.booking_status === "Check-Out"
  ).length;
  const notCanceledBookings = data.filter(
    (d) => d.booking_status === "Not_Canceled"
  ).length;

  // Calculate total revenue from completed stays
  const totalRevenue = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce(
      (sum, d) =>
        sum +
        d.avg_price_per_room * (d.no_of_weekend_nights + d.no_of_week_nights),
      0
    );

  // Calculate Average Daily Rate (ADR) from completed stays
  const completedStays = data.filter((d) => d.booking_status === "Check-Out");
  const totalRoomNights = completedStays.reduce(
    (sum, d) => sum + d.no_of_weekend_nights + d.no_of_week_nights,
    0
  );
  const adr = totalRoomNights > 0 ? totalRevenue / totalRoomNights : 0;

  // Hotel Pacific Reef has 38 rooms (30 Turista + 8 Premium)
  const totalRooms = 38;

  // Calculate occupancy rate based on room nights
  // Assuming average stay length for occupancy calculation
  const avgStayLength = totalRoomNights / completedStays.length || 0;
  const totalRoomNightsAvailable = totalRooms * 365; // Assuming 365 days
  const occupancyRate =
    totalRoomNightsAvailable > 0
      ? (totalRoomNights / totalRoomNightsAvailable) * 100
      : 0;

  // Revenue Per Available Room (RevPAR)
  const revpar = totalRooms > 0 ? totalRevenue / totalRooms : 0;

  // Cancellation rate
  const cancellationRate =
    totalBookings > 0 ? (canceledBookings / totalBookings) * 100 : 0;

  return {
    occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
    adr: Math.round(adr),
    revpar: Math.round(revpar),
    cancellationRate: Math.round(cancellationRate * 10) / 10, // Round to 1 decimal
    totalRevenue: Math.round(totalRevenue),
    totalBookings,
  };
}

export async function getMealPlans(): Promise<string[]> {
  const data = await fetchHotelData();
  return [...new Set(data.map((d) => d.type_of_meal_plan))].filter(Boolean);
}

export async function getMarketSegments(): Promise<string[]> {
  const data = await fetchHotelData();
  return [...new Set(data.map((d) => d.market_segment_type))].filter(Boolean);
}

// New functions for enhanced dashboard analytics
export async function getMonthlyRevenueData(): Promise<
  Array<{ month: string; revenue: number; bookings: number }>
> {
  const data = await fetchHotelData();

  const monthlyData = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce((acc, curr) => {
      const month = `${curr.arrival_year}-${String(curr.arrival_month).padStart(
        2,
        "0"
      )}`;
      const revenue =
        curr.avg_price_per_room *
        (curr.no_of_weekend_nights + curr.no_of_week_nights);

      if (!acc[month]) {
        acc[month] = { revenue: 0, bookings: 0 };
      }
      acc[month].revenue += revenue;
      acc[month].bookings += 1;

      return acc;
    }, {} as Record<string, { revenue: number; bookings: number }>);

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleDateString("es-ES", {
        month: "short",
        year: "numeric",
      }),
      revenue: Math.round(data.revenue),
      bookings: data.bookings,
    }));
}

export async function getRoomTypePerformance(): Promise<
  Array<{
    roomType: string;
    revenue: number;
    bookings: number;
    avgPrice: number;
  }>
> {
  const data = await fetchHotelData();

  const roomTypeData = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce((acc, curr) => {
      const revenue =
        curr.avg_price_per_room *
        (curr.no_of_weekend_nights + curr.no_of_week_nights);

      if (!acc[curr.room_type_reserved]) {
        acc[curr.room_type_reserved] = {
          revenue: 0,
          bookings: 0,
          totalPrice: 0,
        };
      }
      acc[curr.room_type_reserved].revenue += revenue;
      acc[curr.room_type_reserved].bookings += 1;
      acc[curr.room_type_reserved].totalPrice += curr.avg_price_per_room;

      return acc;
    }, {} as Record<string, { revenue: number; bookings: number; totalPrice: number }>);

  return Object.entries(roomTypeData)
    .map(([roomType, data]) => ({
      roomType: roomType.replace("Room_Type ", "Room "),
      revenue: Math.round(data.revenue),
      bookings: data.bookings,
      avgPrice: Math.round(data.totalPrice / data.bookings),
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export async function getGuestDemographics(): Promise<{
  marketSegments: Array<{ segment: string; count: number; percentage: number }>;
  repeatedGuests: { repeated: number; new: number };
  leadTimeDistribution: Array<{ range: string; count: number }>;
}> {
  const data = await fetchHotelData();

  // Market segments
  const segmentCounts = data.reduce((acc, curr) => {
    acc[curr.market_segment_type] = (acc[curr.market_segment_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalBookings = data.length;
  const marketSegments = Object.entries(segmentCounts).map(
    ([segment, count]) => ({
      segment,
      count,
      percentage: Math.round((count / totalBookings) * 100),
    })
  );

  // Repeated guests
  const repeatedGuests = data.reduce(
    (acc, curr) => {
      if (curr.repeated_guest === 1) {
        acc.repeated += 1;
      } else {
        acc.new += 1;
      }
      return acc;
    },
    { repeated: 0, new: 0 }
  );

  // Lead time distribution
  const leadTimeData = data
    .filter((d) => d.lead_time > 0 && d.lead_time < 365)
    .reduce((acc, curr) => {
      let bucket: string;
      if (curr.lead_time <= 7) bucket = "0-7 days";
      else if (curr.lead_time <= 30) bucket = "8-30 days";
      else if (curr.lead_time <= 90) bucket = "31-90 days";
      else bucket = "91+ days";

      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const leadTimeDistribution = Object.entries(leadTimeData).map(
    ([range, count]) => ({
      range,
      count,
    })
  );

  return {
    marketSegments,
    repeatedGuests,
    leadTimeDistribution,
  };
}

export async function getRecentBookings(limit: number = 10): Promise<
  Array<{
    bookingId: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: string;
    revenue: number;
  }>
> {
  const data = await fetchHotelData();

  return data
    .sort((a, b) => {
      // Sort by arrival date (most recent first)
      const dateA = new Date(
        a.arrival_year,
        a.arrival_month - 1,
        a.arrival_date
      );
      const dateB = new Date(
        b.arrival_year,
        b.arrival_month - 1,
        b.arrival_date
      );
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit)
    .map((booking) => {
      const checkInDate = new Date(
        booking.arrival_year,
        booking.arrival_month - 1,
        booking.arrival_date
      );
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(
        checkOutDate.getDate() +
          booking.no_of_weekend_nights +
          booking.no_of_week_nights
      );

      return {
        bookingId: booking.Booking_ID,
        roomType: booking.room_type_reserved.replace(
          "Room_Type ",
          "Room "
        ),
        checkIn: checkInDate.toLocaleDateString("es-ES"),
        checkOut: checkOutDate.toLocaleDateString("es-ES"),
        guests: booking.no_of_adults + booking.no_of_children,
        status:
          booking.booking_status === "Check-Out"
            ? "Completed"
            : booking.booking_status === "Canceled"
            ? "Canceled"
            : "Active",
        revenue: Math.round(
          booking.avg_price_per_room *
            (booking.no_of_weekend_nights + booking.no_of_week_nights)
        ),
      };
    });
}

// Booking interface
export interface BookingData {
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  preferences: {
    mealPlan: string;
    parking: boolean;
    specialRequests?: string;
  };
  payment: {
    method: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
  };
  bookingDetails: {
    roomName: string;
    price: number;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
  };
}

export async function createBooking(
  bookingData: BookingData
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  try {
    const supabase = createClient();

    // Generate booking ID
    const bookingId = `HR-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(
      2,
      "0"
    )}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate total nights
    const checkInDate = new Date(bookingData.bookingDetails.checkIn);
    const checkOutDate = new Date(bookingData.bookingDetails.checkOut);
    const totalNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate weekend nights (simplified - assuming Friday/Saturday are weekends)
    const weekendNights = Math.floor(totalNights / 7) * 2; // Rough calculation
    const weekNights = totalNights - weekendNights;

    // Calculate additional costs
    const mealPlanCost =
      bookingData.preferences.mealPlan !== "No meal plan" ? 25 : 0;
    const parkingCost = bookingData.preferences.parking ? 15 : 0;
    const additionalCostPerNight = mealPlanCost + parkingCost;

    // Prepare data for Supabase
    const reservationData = {
      Booking_ID: bookingId,
      no_of_adults: parseInt(bookingData.bookingDetails.adults),
      no_of_children: parseInt(bookingData.bookingDetails.children),
      no_of_weekend_nights: weekendNights.toString(),
      no_of_week_nights: weekNights.toString(),
      type_of_meal_plan: bookingData.preferences.mealPlan,
      required_car_parking_space: bookingData.preferences.parking ? "1" : "0",
      room_type_reserved: bookingData.bookingDetails.roomName,
      lead_time: 1, // Default lead time
      arrival_year: checkInDate.getFullYear(),
      arrival_month: checkInDate.getMonth() + 1,
      arrival_date: checkInDate.getDate(),
      market_segment_type: "Online", // Default market segment
      repeated_guest: "0", // Default to new guest
      no_of_previous_cancellations: "0",
      no_of_previous_bookings_not_canceled: "0",
      avg_price_per_room:
        bookingData.bookingDetails.price + additionalCostPerNight,
      no_of_special_requests: bookingData.preferences.specialRequests
        ? "1"
        : "0",
      booking_status: "Not_Canceled",
    };

    const { data, error } = await supabase
      .from("hotel_pacific_reef")
      .insert([reservationData] as any);

    if (error) {
      console.error("Error creating booking:", error);
      return { success: false, error: error.message };
    }

    return { success: true, bookingId };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
