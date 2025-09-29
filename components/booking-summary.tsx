import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, MapPin } from "lucide-react"

interface BookingSummaryProps {
  roomName: string
  price: number
  checkIn?: string
  checkOut?: string
  adults: string
  children: string
  nights?: number
  mealPlan?: string
  parking?: boolean
  specialRequests?: string
}

export function BookingSummary({
  roomName,
  price,
  checkIn,
  checkOut,
  adults,
  children,
  nights = 1,
  mealPlan,
  parking,
  specialRequests,
}: BookingSummaryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }
    return nights
  }

  const totalNights = calculateNights()
  const roomTotal = price * totalNights
  const mealPlanCost = mealPlan && mealPlan !== "No meal plan" ? 25 * totalNights : 0
  const parkingCost = parking ? 15 * totalNights : 0
  const taxes = (roomTotal + mealPlanCost + parkingCost) * 0.12
  const total = roomTotal + mealPlanCost + parkingCost + taxes

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Room Details */}
        <div>
          <h3 className="font-semibold text-gray-900">{roomName}</h3>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            {checkIn && checkOut && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(checkIn)} - {formatDate(checkOut)}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>
                {adults} adults, {children} children
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>
                {totalNights} night{totalNights > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Room ({totalNights} night{totalNights > 1 ? "s" : ""})
            </span>
            <span>${roomTotal}</span>
          </div>

          {mealPlan && mealPlan !== "No meal plan" && (
            <div className="flex justify-between">
              <span className="text-gray-600">{mealPlan}</span>
              <span>${mealPlanCost}</span>
            </div>
          )}

          {parking && (
            <div className="flex justify-between">
              <span className="text-gray-600">Parking</span>
              <span>${parkingCost}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Taxes & fees</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>

        {/* Special Requests */}
        {specialRequests && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Special Requests</h4>
              <p className="text-sm text-gray-600 text-pretty">{specialRequests}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
