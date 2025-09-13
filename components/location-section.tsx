import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Clock, Phone, Mail } from "lucide-react"

export function LocationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Prime Location</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Perfectly positioned on the Pacific coast, offering easy access to local attractions and natural wonders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <div className="order-2 lg:order-1">
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <img
                  src="/hotel-location-map-pacific-coast.jpg"
                  alt="Hotel Pacific Reef Location Map"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Location Details */}
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discover Our Paradise</h3>
              <p className="text-gray-600 text-pretty">
                Nestled along the pristine Pacific coastline, Hotel Pacific Reef offers unparalleled access to both
                natural beauty and urban conveniences. Our prime location puts you minutes away from world-class
                attractions, shopping, and dining.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-sm text-gray-600">
                        1234 Pacific Coast Highway
                        <br />
                        Malibu, CA 90265
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-sm text-gray-600">
                        +1 (555) 123-4567
                        <br />
                        Toll Free: 1-800-PACIFIC
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Check-in/out</h4>
                      <p className="text-sm text-gray-600">
                        Check-in: 3:00 PM
                        <br />
                        Check-out: 11:00 AM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-sm text-gray-600">
                        reservations@pacificreef.com
                        <br />
                        concierge@pacificreef.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
