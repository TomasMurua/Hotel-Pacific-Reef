import { Card, CardContent } from "@/components/ui/card"
import {
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Sparkles,
  Coffee,
  Shield,
  MapPin,
  Users,
  Clock,
  Phone,
} from "lucide-react"

const amenities = [
  {
    icon: Wifi,
    title: "Free WiFi",
    description: "High-speed internet throughout the property",
  },
  {
    icon: Waves,
    title: "Infinity Pool",
    description: "Stunning infinity pool with ocean views",
  },
  {
    icon: Utensils,
    title: "Fine Dining",
    description: "World-class restaurants and bars",
  },
  {
    icon: Sparkles,
    title: "Reef Spa",
    description: "Full-service spa and wellness center",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "State-of-the-art gym equipment",
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Complimentary valet parking service",
  },
  {
    icon: Coffee,
    title: "Room Service",
    description: "24/7 in-room dining service",
  },
  {
    icon: Shield,
    title: "Concierge",
    description: "Personal concierge for all your needs",
  },
  {
    icon: MapPin,
    title: "Beach Access",
    description: "Private access to pristine beach",
  },
  {
    icon: Users,
    title: "Event Spaces",
    description: "Elegant venues for special occasions",
  },
  {
    icon: Clock,
    title: "24/7 Front Desk",
    description: "Round-the-clock guest services",
  },
  {
    icon: Phone,
    title: "Business Center",
    description: "Fully equipped business facilities",
  },
]

export function AmenitiesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">World-Class Amenities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Every detail has been carefully crafted to ensure your stay is nothing short of extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{amenity.title}</h3>
                  <p className="text-sm text-gray-600 text-pretty">{amenity.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
