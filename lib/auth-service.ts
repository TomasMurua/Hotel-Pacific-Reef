import type { User } from "./types"

const DEMO_USERS = [
  {
    id: "1",
    email: "admin@hotel.com",
    password: "123456",
    userType: "admin" as const,
    firstName: "Admin",
    lastName: "User",
  },
  {
    id: "2",
    email: "guest@hotel.com",
    password: "123456",
    userType: "guest" as const,
    firstName: "Guest",
    lastName: "User",
  },
]

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = DEMO_USERS.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password: _, ...userWithoutPassword } = user
    const token = `mock-token-${user.id}-${Date.now()}`

    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("hotel-auth-token", token)
      localStorage.setItem("hotel-user", JSON.stringify(userWithoutPassword))
    }

    return { user: userWithoutPassword, token }
  }

  return null
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("hotel-auth-token")
    localStorage.removeItem("hotel-user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("hotel-user")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("hotel-auth-token")
  }
  return false
}
