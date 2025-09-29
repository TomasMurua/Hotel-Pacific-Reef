import type { HotelReservation, RoomType, DashboardMetrics } from "./types"

// CSV data URL from the provided file
const CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hotel%20Reservations-RSe4P8ygXKHMUHTi0znL1q9fmzpyUv.csv"

let cachedData: HotelReservation[] | null = null

export async function fetchHotelData(): Promise<HotelReservation[]> {
  if (cachedData) return cachedData

  try {
    const response = await fetch(CSV_URL)
    const csvText = await response.text()

    const lines = csvText.split("\n")
    const headers = lines[0].split(",")

    const data: HotelReservation[] = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",")
        return {
          Booking_ID: values[0] || "",
          no_of_adults: Number.parseInt(values[1]) || 0,
          no_of_children: Number.parseInt(values[2]) || 0,
          no_of_weekend_nights: Number.parseInt(values[3]) || 0,
          no_of_week_nights: Number.parseInt(values[4]) || 0,
          type_of_meal_plan: values[5] || "",
          required_car_parking_space: Number.parseInt(values[6]) || 0,
          room_type_reserved: values[7] || "",
          lead_time: Number.parseInt(values[8]) || 0,
          arrival_year: Number.parseInt(values[9]) || 0,
          arrival_month: Number.parseInt(values[10]) || 0,
          arrival_date: Number.parseInt(values[11]) || 0,
          market_segment_type: values[12] || "",
          repeated_guest: Number.parseInt(values[13]) || 0,
          no_of_previous_cancellations: Number.parseInt(values[14]) || 0,
          no_of_previous_bookings_not_canceled: Number.parseInt(values[15]) || 0,
          avg_price_per_room: Number.parseFloat(values[16]) || 0,
          no_of_special_requests: Number.parseInt(values[17]) || 0,
          booking_status: values[18] || "",
        }
      })

    cachedData = data
    return data
  } catch (error) {
    console.error("Error fetching hotel data:", error)
    return []
  }
}

export async function getRoomTypes(): Promise<RoomType[]> {
  const data = await fetchHotelData()
  const uniqueRoomTypes = [...new Set(data.map((d) => d.room_type_reserved))]

  return uniqueRoomTypes.map((roomType, index) => {
    const roomData = data.filter((d) => d.room_type_reserved === roomType)
    const avgPrice = roomData.reduce((sum, r) => sum + r.avg_price_per_room, 0) / roomData.length
    const maxAdults = Math.max(...roomData.map((r) => r.no_of_adults))
    const maxChildren = Math.max(...roomData.map((r) => r.no_of_children))

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
    }
  })
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const data = await fetchHotelData()

  const totalBookings = data.length
  const canceledBookings = data.filter((d) => d.booking_status === "Canceled").length
  const checkedOutBookings = data.filter((d) => d.booking_status === "Check-Out").length

  const totalRevenue = data
    .filter((d) => d.booking_status === "Check-Out")
    .reduce((sum, d) => sum + d.avg_price_per_room * (d.no_of_weekend_nights + d.no_of_week_nights), 0)

  const avgPrice = data.reduce((sum, d) => sum + d.avg_price_per_room, 0) / data.length

  // Assuming 100 total rooms for calculation
  const totalRooms = 100
  const occupiedRooms = checkedOutBookings

  return {
    occupancyRate: (occupiedRooms / totalRooms) * 100,
    adr: Math.round(avgPrice),
    revpar: Math.round(totalRevenue / totalRooms),
    cancellationRate: (canceledBookings / totalBookings) * 100,
    totalRevenue: Math.round(totalRevenue),
    totalBookings,
  }
}

export async function getMealPlans(): Promise<string[]> {
  const data = await fetchHotelData()
  return [...new Set(data.map((d) => d.type_of_meal_plan))].filter(Boolean)
}

export async function getMarketSegments(): Promise<string[]> {
  const data = await fetchHotelData()
  return [...new Set(data.map((d) => d.market_segment_type))].filter(Boolean)
}
