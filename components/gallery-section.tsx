"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    src: "/luxury-hotel-lobby-with-ocean-view.jpg",
    alt: "Elegant hotel lobby with panoramic ocean views",
    title: "Grand Lobby",
  },
  {
    src: "/hotel-infinity-pool-overlooking-ocean.jpg",
    alt: "Infinity pool overlooking the Pacific Ocean",
    title: "Infinity Pool",
  },
  {
    src: "/luxury-hotel-suite-bedroom-ocean-view.jpg",
    alt: "Luxury suite with ocean view and modern amenities",
    title: "Ocean Suite",
  },
  {
    src: "/hotel-restaurant-fine-dining-ocean-view.jpg",
    alt: "Fine dining restaurant with ocean views",
    title: "Pacific Restaurant",
  },
  {
    src: "/hotel-spa-wellness-center.jpg",
    alt: "Tranquil spa and wellness center",
    title: "Reef Spa",
  },
  {
    src: "/hotel-beach-private-access.jpg",
    alt: "Private beach access with white sand",
    title: "Private Beach",
  },
]

export function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Discover Paradise</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Immerse yourself in the beauty of Hotel Pacific Reef through our stunning spaces and breathtaking views.
          </p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3] md:aspect-[16/9]">
              <img
                src={galleryImages[currentIndex].src || "/placeholder.svg"}
                alt={galleryImages[currentIndex].alt}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Image Title */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
                <h3 className="font-semibold">{galleryImages[currentIndex].title}</h3>
              </div>
            </div>
          </Card>

          {/* Thumbnail Navigation */}
          <div className="flex justify-center mt-6 space-x-2 overflow-x-auto pb-2">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-primary shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
