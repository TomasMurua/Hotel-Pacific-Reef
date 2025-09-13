import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Hotel Pacific Reef",
  description: "Hotel management dashboard for Pacific Reef",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
