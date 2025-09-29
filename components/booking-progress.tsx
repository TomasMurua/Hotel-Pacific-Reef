import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingProgressProps {
  currentStep: number
  steps: string[]
}

export function BookingProgress({ currentStep, steps }: BookingProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                  isCompleted && "bg-primary border-primary text-white",
                  isCurrent && "border-primary text-primary bg-primary/10",
                  isUpcoming && "border-gray-300 text-gray-400",
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3 hidden sm:block">
                <p
                  className={cn(
                    "text-sm font-medium",
                    (isCompleted || isCurrent) && "text-gray-900",
                    isUpcoming && "text-gray-400",
                  )}
                >
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all",
                    isCompleted && "bg-primary",
                    !isCompleted && "bg-gray-300",
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
