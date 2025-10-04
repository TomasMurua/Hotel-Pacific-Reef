// Hotel Pacific Reef - Business Logic Types
// Interfaces específicas para el negocio hotelero

import { Tables, Database, Enums } from "./database.types";

// =============================================================================
// USER TYPES - Roles específicos del hotel
// =============================================================================

export type UserRole = Enums<"user_role">;
export type UserLanguage = Enums<"user_language">;

export interface User extends Tables<"users"> {}

export interface UserWithAuth extends User {
  auth_id?: string; // Supabase Auth ID
}

// Interfaces específicas por rol
export interface Tourist extends User {
  role: "turista";
  total_reservations?: number;
  loyalty_points?: number;
}

export interface Administrator extends User {
  role: "administrador";
  permissions: AdminPermission[];
}

export interface Staff extends User {
  role: "personal";
  department: "recepcion" | "limpieza" | "mantenimiento" | "seguridad";
  shift: "mañana" | "tarde" | "noche";
}

export interface Owner extends User {
  role: "dueña";
}

export type AdminPermission =
  | "manage_reservations"
  | "manage_rooms"
  | "manage_users"
  | "view_reports"
  | "manage_payments"
  | "system_settings";

// =============================================================================
// ROOM TYPES - 38 habitaciones del Pacific Reef
// =============================================================================

export type PacificReefCategory = Enums<"pacific_reef_category">;

export interface RoomType extends Tables<"room_types"> {
  pacific_reef_category: PacificReefCategory;
}

export interface Room extends Tables<"rooms"> {
  room_type?: RoomType;
}

// Mapeo de Room_Type 1-7 a categorías del Pacific Reef
export interface RoomTypeMapping {
  1: "Turista"; // Room_Type 1
  2: "Turista"; // Room_Type 2
  3: "Turista"; // Room_Type 3
  4: "Turista"; // Room_Type 4
  5: "Premium"; // Room_Type 5
  6: "Premium"; // Room_Type 6
  7: "Premium"; // Room_Type 7
}

// Interfaces específicas por categoría
export interface TuristaRoom extends Room {
  floor: 1 | 2 | 3 | 4 | 5; // Pisos 1-5
  pacific_reef_category: "Turista";
}

export interface PremiumRoom extends Room {
  floor: 6 | 7; // Pisos 6-7
  pacific_reef_category: "Premium";
  premium_amenities: string[]; // Amenities exclusivos Premium
}

// Estructura del hotel: 38 habitaciones total
export interface HotelStructure {
  total_rooms: 38;
  turista_rooms: 30; // Pisos 1-5
  premium_rooms: 8; // Pisos 6-7
  floors: 7;
  rooms_per_floor: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    7: number;
  };
}

// =============================================================================
// RESERVATION TYPES - Lógica de reservas con 30% de anticipo
// =============================================================================

export type ReservationStatus = Enums<"reservation_status">;

export interface Reservation extends Tables<"reservations"> {
  user?: User;
  room?: Room;
  meal_plan?: MealPlan;
  market_segment?: MarketSegment;
  payments?: Payment[];
}

export interface ReservationWithDetails extends Reservation {
  room_details: Room & { room_type: RoomType };
  user_details: User;
  payment_summary: PaymentSummary;
}

// Lógica de reserva del 30%
export interface ReservationLogic {
  total_amount: number;
  reservation_amount: number; // 30% del total
  pending_amount: number; // 70% restante
  deposit_percentage: 0.3; // 30% requerido
}

// Estados de reserva específicos del hotel
export interface ReservationStates {
  Not_Canceled: "Confirmed - Active";
  Canceled: "Canceled";
  Check_In: "In Progress";
  Check_Out: "Completed";
}

// Validaciones de reserva
export interface ReservationValidation {
  minimum_stay: 1; // días mínimos
  maximum_stay: 30; // días máximos
  advance_booking_limit: 365; // días de anticipación máxima
  cancellation_hours: 24; // horas para cancelar sin penalización
}

// =============================================================================
// PAYMENT TYPES - Sistema de pagos
// =============================================================================

export type PaymentMethod = Enums<"payment_method">;
export type PaymentStatus = Enums<"payment_status">;

export interface Payment extends Tables<"payments"> {
  reservation?: Reservation;
}

export interface PaymentSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  payments: Payment[];
  is_fully_paid: boolean;
  next_payment_due?: Date;
}

// =============================================================================
// BUSINESS LOGIC TYPES - Operaciones del hotel
// =============================================================================

export interface MealPlan extends Tables<"meal_plans"> {}

export interface MarketSegment extends Tables<"market_segments"> {}

// Rotación de habitaciones: 4-6 habitaciones/día
export interface DailyOccupancy {
  date: string;
  total_rooms: 38;
  occupied_rooms: number;
  available_rooms: number;
  checkout_rooms: number; // 4-6 habitaciones típicamente
  checkin_rooms: number;
  occupancy_rate: number; // Porcentaje
}

// Estadías típicas: 3-12 días
export interface StayDuration {
  minimum: 3;
  maximum: 12;
  average: 7;
  most_common: 5;
}

// =============================================================================
// QR CODE & TICKET SYSTEM
// =============================================================================

export interface QRTicket {
  reservation_id: number;
  qr_code: string;
  guest_name: string;
  room_number: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  confirmation_number: string;
  language: UserLanguage;
}

// =============================================================================
// ANALYTICS & REPORTING TYPES
// =============================================================================

export type ReportType = Enums<"report_type">;

export interface Report extends Tables<"reports"> {
  generated_by_user?: User;
}

export interface OccupancyReport {
  period: { start: string; end: string };
  total_rooms: 38;
  average_occupancy: number;
  peak_dates: string[];
  low_dates: string[];
  revenue_impact: number;
}

export interface RevenueReport {
  period: { start: string; end: string };
  total_revenue: number;
  room_revenue: number;
  services_revenue: number;
  average_daily_rate: number;
  revenue_per_available_room: number;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface APIResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
  status: "success" | "error" | "loading";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// =============================================================================
// SEARCH & FILTERING TYPES
// =============================================================================

export interface RoomSearchFilters {
  check_in?: string;
  check_out?: string;
  guests?: number;
  room_type?: PacificReefCategory;
  price_range?: {
    min: number;
    max: number;
  };
  amenities?: string[];
}

export interface ReservationFilters {
  status?: ReservationStatus;
  date_range?: {
    start: string;
    end: string;
  };
  guest_name?: string;
  room_number?: string;
  booking_id?: string;
}

// =============================================================================
// FORM TYPES - Para componentes de UI
// =============================================================================

export interface CreateReservationForm {
  user_id?: number;
  guest_details: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    rut?: string;
  };
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  no_of_adults: number;
  no_of_children: number;
  meal_plan_id?: number;
  special_requests?: string;
  parking_required: boolean;
  language: UserLanguage;
}

export interface PaymentForm {
  reservation_id: number;
  amount: number;
  payment_method: PaymentMethod;
  card_details?: {
    number: string;
    expiry: string;
    cvv: string;
    holder_name: string;
  };
}

// =============================================================================
// CONSTANTS - Valores del negocio
// =============================================================================

export const HOTEL_CONSTANTS = {
  TOTAL_ROOMS: 38,
  TURISTA_ROOMS: 30,
  PREMIUM_ROOMS: 8,
  FLOORS: 7,
  DEPOSIT_PERCENTAGE: 0.3, // 30%
  DAILY_ROTATION: { min: 4, max: 6 }, // habitaciones/día
  STAY_DURATION: { min: 3, max: 12 }, // días
  CANCELLATION_HOURS: 24,
  LANGUAGES: ["es", "en"] as const,
  ROOM_TYPE_MAPPING: {
    1: "Turista",
    2: "Turista",
    3: "Turista",
    4: "Turista",
    5: "Premium",
    6: "Premium",
    7: "Premium",
  } as const,
} as const;

