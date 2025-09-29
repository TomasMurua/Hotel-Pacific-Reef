import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "San Francisco, CA",
    rating: 5,
    comment:
      "Absolutely breathtaking! The ocean views from our suite were incredible, and the service was impeccable. We'll definitely be back for our anniversary next year.",
    image: "/professional-woman-headshot.png",
  },
  {
    name: "Michael Chen",
    location: "Seattle, WA",
    rating: 5,
    comment:
      "The perfect blend of luxury and relaxation. The spa treatments were divine, and the infinity pool at sunset was magical. Highly recommend!",
    image: "/professional-man-headshot.png",
  },
  {
    name: "Emily Rodriguez",
    location: "Los Angeles, CA",
    rating: 5,
    comment:
      "Our family vacation was unforgettable. The kids loved the beach access, and we enjoyed the fine dining. The staff went above and beyond to make our stay special.",
    image: "/avatar-1.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Don't just take our word for it. Here's what our valued guests have to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 text-pretty">"{testimonial.comment}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
