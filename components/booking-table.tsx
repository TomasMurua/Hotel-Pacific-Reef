"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { Search, Eye, Edit, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchHotelData } from "@/lib/data-service"
import type { HotelReservation } from "@/lib/types"

export function BookingTable() {
  const [bookings, setBookings] = useState<HotelReservation[]>([])
  const [filteredBookings, setFilteredBookings] = useState<HotelReservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<HotelReservation | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [roomTypeFilter, setRoomTypeFilter] = useState("All")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await fetchHotelData()
        // Add mock guest names and contact info
        const enrichedData = data.map((booking, index) => ({
          ...booking,
          guestName: `Guest ${String(index + 1).padStart(4, "0")}`,
          guestEmail: `guest${index + 1}@email.com`,
          guestPhone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        }))
        setBookings(enrichedData)
        setFilteredBookings(enrichedData)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.Booking_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((booking) => booking.booking_status === statusFilter)
    }

    // Room type filter
    if (roomTypeFilter !== "All") {
      filtered = filtered.filter((booking) => booking.room_type_reserved === roomTypeFilter)
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.arrival_year, booking.arrival_month - 1, booking.arrival_date)
        if (dateFrom && bookingDate < dateFrom) return false
        if (dateTo && bookingDate > dateTo) return false
        return true
      })
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }, [bookings, searchTerm, statusFilter, roomTypeFilter, dateFrom, dateTo])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Check-Out":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "Canceled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "No-Show":
        return <Badge className="bg-red-100 text-red-800">No Show</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (year: number, month: number, date: number) => {
    return new Date(year, month - 1, date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All")
    setRoomTypeFilter("All")
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBookings = filteredBookings.slice(startIndex, endIndex)

  const uniqueStatuses = [...new Set(bookings.map((b) => b.booking_status))]
  const uniqueRoomTypes = [...new Set(bookings.map((b) => b.room_type_reserved))]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Filters</span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Room Types</SelectItem>
                {uniqueRoomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace("Room_Type ", "Room ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePicker date={dateFrom} onDateChange={setDateFrom} placeholder="From date" />

            <DatePicker date={dateTo} onDateChange={setDateTo} placeholder="To date" />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""} found
          </h3>
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} results
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((booking) => (
                  <TableRow key={booking.Booking_ID}>
                    <TableCell className="font-medium">{booking.Booking_ID}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.guestName}</p>
                        <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>{booking.room_type_reserved.replace("Room_Type ", "Room ")}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.arrival_year, booking.arrival_month, booking.arrival_date)}</p>
                        <p className="text-gray-500">
                          {booking.no_of_weekend_nights + booking.no_of_week_nights} night
                          {booking.no_of_weekend_nights + booking.no_of_week_nights > 1 ? "s" : ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.no_of_adults}A, {booking.no_of_children}C
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.booking_status)}</TableCell>
                    <TableCell className="font-medium">
                      $
                      {(
                        booking.avg_price_per_room *
                        (booking.no_of_weekend_nights + booking.no_of_week_nights)
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details - {booking.Booking_ID}</DialogTitle>
                            </DialogHeader>
                            {selectedBooking && (
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Guest Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Name:</strong> {selectedBooking.guestName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedBooking.guestEmail}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {selectedBooking.guestPhone}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Booking Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Room:</strong> {selectedBooking.room_type_reserved}
                                      </p>
                                      <p>
                                        <strong>Guests:</strong> {selectedBooking.no_of_adults} adults,{" "}
                                        {selectedBooking.no_of_children} children
                                      </p>
                                      <p>
                                        <strong>Meal Plan:</strong> {selectedBooking.type_of_meal_plan}
                                      </p>
                                      <p>
                                        <strong>Parking:</strong>{" "}
                                        {selectedBooking.required_car_parking_space ? "Yes" : "No"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Stay Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Check-in:</strong>{" "}
                                        {formatDate(
                                          selectedBooking.arrival_year,
                                          selectedBooking.arrival_month,
                                          selectedBooking.arrival_date,
                                        )}
                                      </p>
                                      <p>
                                        <strong>Nights:</strong>{" "}
                                        {selectedBooking.no_of_weekend_nights + selectedBooking.no_of_week_nights}
                                      </p>
                                      <p>
                                        <strong>Status:</strong> {selectedBooking.booking_status}
                                      </p>
                                      <p>
                                        <strong>Lead Time:</strong> {selectedBooking.lead_time} days
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Financial</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <strong>Rate:</strong> ${selectedBooking.avg_price_per_room}/night
                                      </p>
                                      <p>
                                        <strong>Total:</strong> $
                                        {(
                                          selectedBooking.avg_price_per_room *
                                          (selectedBooking.no_of_weekend_nights + selectedBooking.no_of_week_nights)
                                        ).toFixed(2)}
                                      </p>
                                      <p>
                                        <strong>Market Segment:</strong> {selectedBooking.market_segment_type}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
