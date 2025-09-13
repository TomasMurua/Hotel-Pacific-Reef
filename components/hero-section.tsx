"use client"

import { SearchWidget } from "./search-widget"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/luxury-hotel-pacific-ocean-view-sunset.jpg"
          alt="Vista al Océano del Hotel Pacific Reef"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hotel-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance">
            Hotel Pacific Reef
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto text-pretty">
            Experimenta el lujo donde el océano se encuentra con el paraíso. Descubre tu escape perfecto con vistas
            impresionantes, amenidades de clase mundial y recuerdos inolvidables.
          </p>
        </div>

        {/* Search Widget */}
        <div className="max-w-5xl mx-auto">
          <SearchWidget variant="hero" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
