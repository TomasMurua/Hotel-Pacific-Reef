"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Users, Bed, Wifi, Car, Coffee, Sparkles } from "lucide-react"
import type { RoomType } from "@/lib/types"

interface RoomCardProps {
  room: RoomType
  onSelect: (room: RoomType) => void
  isLoading?: boolean
}

export function RoomCard({ room, onSelect, isLoading = false }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length)
  }

  const getAvailabilityBadge = () => {
    const random = Math.random()
    if (random > 0.8) {
      return <Badge variant="destructive">Only 2 left</Badge>
    }
    if (random > 0.6) {
      return <Badge variant="secondary">Limited availability</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Available</Badge>
  }

  const amenityIcons = {
    WiFi: Wifi,
    "Air Conditioning": Sparkles,
    "Room Service": Coffee,
    TV: Bed,
    Parking: Car,
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.images[currentImageIndex] || "/placeholder.svg"}
          alt={`${room.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Navigation Buttons */}
        {room.images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {room.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {room.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">{getAvailabilityBadge()}</div>
      </div>

      <CardContent className="p-6">
        {/* Room Title and Capacity */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{room.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="h-4 w-4 mr-1" />
              <span>
                Up to {room.capacity.adults} adults, {room.capacity.children} children
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 text-pretty">{room.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {room.amenities.slice(0, 4).map((amenity, index) => {
            const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Sparkles
            return (
              <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <IconComponent className="h-3 w-3 mr-1" />
                {amenity}
              </div>
            )
          })}
          {room.amenities.length > 4 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              +{room.amenities.length - 4} more
            </div>
          )}
        </div>

        {/* Price and Select Button */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold text-primary">${room.price}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
          <Button
            onClick={() => onSelect(room)}
            disabled={isLoading}
            className="hotel-gradient text-white hover:opacity-90 transition-opacity px-6"
          >
            {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : "Select Room"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
