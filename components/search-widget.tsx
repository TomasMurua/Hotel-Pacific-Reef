"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WorkingDatePicker as DatePicker } from "@/components/ui/working-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchWidgetProps {
  className?: string;
  variant?: "hero" | "compact";
}

export function SearchWidget({
  className,
  variant = "hero",
}: SearchWidgetProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [roomType, setRoomType] = useState("Cualquier tipo de habitación");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      setError("Por favor seleccione las fechas de entrada y salida");
      return;
    }

    if (checkOut <= checkIn) {
      setError("La fecha de salida debe ser posterior a la fecha de entrada");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const searchParams = new URLSearchParams({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults,
      children,
      ...(roomType !== "Cualquier tipo de habitación" && { roomType }),
    });

    router.push(`/rooms?${searchParams.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <Card
      className={cn(
        "p-6",
        isHero ? "bg-white/95 backdrop-blur-sm shadow-2xl" : "bg-card",
        className
      )}
    >
      <div
        className={cn(
          "grid gap-4",
          isHero
            ? "grid-cols-1 md:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        )}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Entrada</label>
          <DatePicker
            date={checkIn}
            onDateChange={(date) => {
              setCheckIn(date);
              // Clear check-out if it's before or equal to the new check-in date
              if (date && checkOut && checkOut <= date) {
                setCheckOut(undefined);
              }
            }}
            placeholder="Seleccionar fecha"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Salida</label>
          <DatePicker
            date={checkOut}
            onDateChange={setCheckOut}
            placeholder="Seleccionar fecha"
            className="w-full"
            disabled={!checkIn}
            minDate={
              checkIn
                ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000)
                : undefined
            }
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Adultos</label>
          <Select value={adults} onValueChange={setAdults}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Adulto{num > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Niños</label>
          <Select value={children} onValueChange={setChildren}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Niño{num > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={cn("space-y-2", isHero && "md:col-span-1")}>
          <label className="text-sm font-medium text-gray-700">
            {isHero ? "Buscar" : "Tipo de Habitación"}
          </label>
          {isHero ? (
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          ) : (
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Cualquier habitación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cualquier tipo de habitación">
                  Cualquier tipo de habitación
                </SelectItem>
                <SelectItem value="Room_Type 1">Habitación Estándar</SelectItem>
                <SelectItem value="Room_Type 2">Habitación Deluxe</SelectItem>
                <SelectItem value="Room_Type 3">Suite Junior</SelectItem>
                <SelectItem value="Room_Type 4">Suite Premium</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {!isHero && (
          <div className="sm:col-span-2 lg:col-span-1 flex items-end">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </Card>
  );
}
