"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RoomFiltersProps {
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedRoomType: string
  onRoomTypeChange: (type: string) => void
  selectedAmenities: string[]
  onAmenitiesChange: (amenities: string[]) => void
  onClearFilters: () => void
  isOpen: boolean
  onToggle: () => void
}

const amenitiesList = ["WiFi", "Air Conditioning", "Room Service", "TV", "Parking", "Ocean View", "Balcony", "Minibar"]

const roomTypes = [
  "All Types",
  "Room_Type 1",
  "Room_Type 2",
  "Room_Type 3",
  "Room_Type 4",
  "Room_Type 5",
  "Room_Type 6",
]

export function RoomFilters({
  priceRange,
  onPriceRangeChange,
  selectedRoomType,
  onRoomTypeChange,
  selectedAmenities,
  onAmenitiesChange,
  onClearFilters,
  isOpen,
  onToggle,
}: RoomFiltersProps) {
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      onAmenitiesChange([...selectedAmenities, amenity])
    } else {
      onAmenitiesChange(selectedAmenities.filter((a) => a !== amenity))
    }
  }

  const hasActiveFilters =
    priceRange[0] > 50 || priceRange[1] < 500 || selectedRoomType !== "All Types" || selectedAmenities.length > 0

  return (
    <div className={`lg:block ${isOpen ? "block" : "hidden"}`}>
      <Card className="sticky top-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-primary">
                Clear all
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onToggle} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Price Range (per night)</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                max={500}
                min={50}
                step={10}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Room Type</Label>
            <Select value={selectedRoomType} onValueChange={onRoomTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "All Types" ? "All Types" : type.replace("Room_Type ", "Room Type ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Amenities</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                  />
                  <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
