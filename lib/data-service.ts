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

    return {
      id: `room-${index + 1}`,
      name: roomType,
      capacity: {
        adults: maxAdults || 2,
        children: maxChildren || 2,
      },
      price: Math.round(avgPrice),
      amenities: ["WiFi", "Air Conditioning", "Room Service", "TV"],
      images: [
        `/placeholder.svg?height=300&width=400&query=${roomType} hotel room interior`,
        `/placeholder.svg?height=300&width=400&query=${roomType} hotel room bathroom`,
        `/placeholder.svg?height=300&width=400&query=${roomType} hotel room view`,
      ],
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

  const totalRevenue = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce(
      (sum, d) =>
        sum +
        d.avg_price_per_room * (d.no_of_weekend_nights + d.no_of_week_nights),
      0
    );

  const avgPrice =
    data.reduce((sum, d) => sum + d.avg_price_per_room, 0) / data.length;

  // Assuming 100 total rooms for calculation
  const totalRooms = 100;
  const occupiedRooms = checkedOutBookings;

  return {
    occupancyRate: (occupiedRooms / totalRooms) * 100,
    adr: Math.round(avgPrice),
    revpar: Math.round(totalRevenue / totalRooms),
    cancellationRate: (canceledBookings / totalBookings) * 100,
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
      .insert([reservationData]);

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
