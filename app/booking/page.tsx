"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { BookingProgress } from "@/components/booking-progress"
import { BookingSummary } from "@/components/booking-summary"
import { Footer } from "@/components/footer"
import { ArrowLeft, ArrowRight, CreditCard, Check } from "lucide-react"
import { getMealPlans } from "@/lib/data-service"

const guestInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  idNumber: z.string().min(5, "Please enter a valid ID number"),
})

const preferencesSchema = z.object({
  mealPlan: z.string(),
  parking: z.boolean(),
  specialRequests: z.string().optional(),
})

const paymentSchema = z.object({
  method: z.string().min(1, "Please select a payment method"),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
})

const steps = ["Guest Information", "Preferences", "Payment", "Confirmation"]

function BookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [mealPlans, setMealPlans] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Get booking parameters
  const roomId = searchParams.get("roomId") || ""
  const roomName = searchParams.get("roomName") || "Selected Room"
  const price = Number.parseInt(searchParams.get("price") || "0")
  const checkIn = searchParams.get("checkIn") || ""
  const checkOut = searchParams.get("checkOut") || ""
  const adults = searchParams.get("adults") || "2"
  const children = searchParams.get("children") || "0"

  // Form states
  const [guestInfo, setGuestInfo] = useState({})
  const [preferences, setPreferences] = useState({})
  const [payment, setPayment] = useState({})
  const [bookingId, setBookingId] = useState("")

  // Forms
  const guestForm = useForm({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNumber: "",
    },
  })

  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      mealPlan: "No meal plan",
      parking: false,
      specialRequests: "",
    },
  })

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  })

  useEffect(() => {
    const fetchMealPlans = async () => {
      const plans = await getMealPlans()
      setMealPlans(["No meal plan", ...plans])
    }
    fetchMealPlans()
  }, [])

  const handleNext = async () => {
    setIsLoading(true)

    if (currentStep === 1) {
      const isValid = await guestForm.trigger()
      if (isValid) {
        setGuestInfo(guestForm.getValues())
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      const isValid = await preferencesForm.trigger()
      if (isValid) {
        setPreferences(preferencesForm.getValues())
        setCurrentStep(3)
      }
    } else if (currentStep === 3) {
      const isValid = await paymentForm.trigger()
      if (isValid) {
        setPayment(paymentForm.getValues())
        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const newBookingId = `HR-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
        setBookingId(newBookingId)
        setCurrentStep(4)
      }
    }

    setIsLoading(false)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...guestForm.register("firstName")}
                    className={guestForm.formState.errors.firstName ? "border-red-500" : ""}
                  />
                  {guestForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{guestForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...guestForm.register("lastName")}
                    className={guestForm.formState.errors.lastName ? "border-red-500" : ""}
                  />
                  {guestForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{guestForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...guestForm.register("email")}
                  className={guestForm.formState.errors.email ? "border-red-500" : ""}
                />
                {guestForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{guestForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...guestForm.register("phone")}
                    className={guestForm.formState.errors.phone ? "border-red-500" : ""}
                  />
                  {guestForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{guestForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    {...guestForm.register("idNumber")}
                    className={guestForm.formState.errors.idNumber ? "border-red-500" : ""}
                  />
                  {guestForm.formState.errors.idNumber && (
                    <p className="text-red-500 text-sm mt-1">{guestForm.formState.errors.idNumber.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="mealPlan">Meal Plan</Label>
                <Select
                  value={preferencesForm.watch("mealPlan")}
                  onValueChange={(value) => preferencesForm.setValue("mealPlan", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealPlans.map((plan) => (
                      <SelectItem key={plan} value={plan}>
                        {plan} {plan !== "No meal plan" && "(+$25/night)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={preferencesForm.watch("parking")}
                  onCheckedChange={(checked) => preferencesForm.setValue("parking", checked as boolean)}
                />
                <Label htmlFor="parking">Parking required (+$15/night)</Label>
              </div>

              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or requirements..."
                  {...preferencesForm.register("specialRequests")}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="method">Payment Method *</Label>
                <Select
                  value={paymentForm.watch("method")}
                  onValueChange={(value) => paymentForm.setValue("method", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {paymentForm.formState.errors.method && (
                  <p className="text-red-500 text-sm mt-1">{paymentForm.formState.errors.method.message}</p>
                )}
              </div>

              {(paymentForm.watch("method") === "credit" || paymentForm.watch("method") === "debit") && (
                <>
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input id="cardholderName" {...paymentForm.register("cardholderName")} />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...paymentForm.register("cardNumber")} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input id="expiryDate" placeholder="MM/YY" {...paymentForm.register("expiryDate")} />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input id="cvv" placeholder="123" {...paymentForm.register("cvv")} />
                    </div>
                  </div>
                </>
              )}

              {paymentForm.watch("method") === "transfer" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Bank Transfer Details</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Bank: Pacific National Bank</p>
                    <p>Account: Hotel Pacific Reef</p>
                    <p>Account Number: 1234567890</p>
                    <p>Routing Number: 987654321</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <p className="text-lg font-semibold text-gray-900">Booking ID: {bookingId}</p>
                <p className="text-gray-600">
                  Your reservation has been confirmed. You will receive a confirmation email shortly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full bg-transparent">
                  Download Voucher
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Email Confirmation
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Modify Booking
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check-in: 3:00 PM on your arrival date</li>
                  <li>• Check-out: 11:00 AM on your departure date</li>
                  <li>• Bring a valid ID and credit card for incidentals</li>
                  <li>• Contact us at +1 (555) 123-4567 for any questions</li>
                </ul>
              </div>

              <Button onClick={() => router.push("/")} className="w-full hotel-gradient text-white">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
            </div>
          </div>

          <BookingProgress currentStep={currentStep} steps={steps} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={isLoading} className="hotel-gradient text-white">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <>
                      {currentStep === 3 ? "Complete Booking" : "Next"}
                      {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              roomName={roomName}
              price={price}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              children={children}
              mealPlan={preferencesForm.watch("mealPlan")}
              parking={preferencesForm.watch("parking")}
              specialRequests={preferencesForm.watch("specialRequests")}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  )
}
