// Hotel reservation system types
export interface HotelReservation {
  Booking_ID: string
  no_of_adults: number
  no_of_children: number
  no_of_weekend_nights: number
  no_of_week_nights: number
  type_of_meal_plan: string
  required_car_parking_space: number
  room_type_reserved: string
  lead_time: number
  arrival_year: number
  arrival_month: number
  arrival_date: number
  market_segment_type: string
  repeated_guest: number
  no_of_previous_cancellations: number
  no_of_previous_bookings_not_canceled: number
  avg_price_per_room: number
  no_of_special_requests: number
  booking_status: string
  // Added for UI purposes
  guestName?: string
  guestEmail?: string
  guestPhone?: string
}

export interface RoomType {
  id: string
  name: string
  capacity: {
    adults: number
    children: number
  }
  price: number
  amenities: string[]
  images: string[]
  description: string
}

export interface BookingForm {
  checkIn: Date
  checkOut: Date
  adults: number
  children: number
  roomType: string
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    idNumber: string
  }
  preferences: {
    mealPlan: string
    parking: boolean
    specialRequests: string
  }
  payment: {
    method: string
    cardNumber?: string
    expiryDate?: string
    cvv?: string
  }
}

export interface User {
  id: string
  email: string
  userType: "admin" | "guest"
  firstName?: string
  lastName?: string
}

export interface DashboardMetrics {
  occupancyRate: number
  adr: number // Average Daily Rate
  revpar: number // Revenue Per Available Room
  cancellationRate: number
  totalRevenue: number
  totalBookings: number
}

// Fix the type alias
export type DashboardMetricsType = DashboardMetrics
