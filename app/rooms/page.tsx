"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { SearchWidget } from "@/components/search-widget"
import { RoomCard } from "@/components/room-card"
import { RoomFilters } from "@/components/room-filters"
import { Footer } from "@/components/footer"
import { Filter, ArrowLeft } from "lucide-react"
import { getRoomTypes } from "@/lib/data-service"
import type { RoomType } from "@/lib/types"

function RoomsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 500])
  const [selectedRoomType, setSelectedRoomType] = useState("All Types")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Get search parameters
  const checkIn = searchParams.get("checkIn")
  const checkOut = searchParams.get("checkOut")
  const adults = searchParams.get("adults") || "2"
  const children = searchParams.get("children") || "0"
  const roomType = searchParams.get("roomType")

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await getRoomTypes()
        setRooms(roomData)
        setFilteredRooms(roomData)

        // Set initial room type filter if provided in search params
        if (roomType && roomType !== "Any room type") {
          setSelectedRoomType(roomType)
        }
      } catch (error) {
        console.error("Error fetching rooms:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [roomType])

  // Apply filters
  useEffect(() => {
    let filtered = rooms

    // Price filter
    filtered = filtered.filter((room) => room.price >= priceRange[0] && room.price <= priceRange[1])

    // Room type filter
    if (selectedRoomType !== "All Types") {
      filtered = filtered.filter((room) => room.name === selectedRoomType)
    }

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((room) => selectedAmenities.every((amenity) => room.amenities.includes(amenity)))
    }

    setFilteredRooms(filtered)
  }, [rooms, priceRange, selectedRoomType, selectedAmenities])

  const handleRoomSelect = async (room: RoomType) => {
    setSelectedRoom(room.id)

    // Simulate selection delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const bookingParams = new URLSearchParams({
      roomId: room.id,
      roomName: room.name,
      price: room.price.toString(),
      ...(checkIn && { checkIn }),
      ...(checkOut && { checkOut }),
      adults,
      children,
    })

    router.push(`/booking?${bookingParams.toString()}`)
  }

  const clearFilters = () => {
    setPriceRange([50, 500])
    setSelectedRoomType("All Types")
    setSelectedAmenities([])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900">Available Rooms</h1>
                {checkIn && checkOut && (
                  <p className="text-gray-600">
                    {formatDate(checkIn)} - {formatDate(checkOut)} • {adults} adults, {children} children
                  </p>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Compact Search Widget */}
          <SearchWidget variant="compact" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <RoomFilters
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedRoomType={selectedRoomType}
              onRoomTypeChange={setSelectedRoomType}
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={setSelectedAmenities}
              onClearFilters={clearFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>

          {/* Rooms Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
              </h2>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more options.</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelect={handleRoomSelect}
                    isLoading={selectedRoom === room.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      }
    >
      <RoomsPageContent />
    </Suspense>
  )
}
