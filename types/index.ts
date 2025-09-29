// Hotel Pacific Reef - Types Index
// Exporta todos los tipos para fácil importación

// Database types (generated from Supabase)
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Enums,
  Json,
} from "./database.types";

// Hotel business logic types
export type {
  // User types
  User,
  UserWithAuth,
  UserRole,
  UserLanguage,
  Tourist,
  Administrator,
  Staff,
  Owner,
  AdminPermission,

  // Room types
  Room,
  RoomType,
  TuristaRoom,
  PremiumRoom,
  PacificReefCategory,
  RoomTypeMapping,
  HotelStructure,

  // Reservation types
  Reservation,
  ReservationWithDetails,
  ReservationStatus,
  ReservationLogic,
  ReservationStates,
  ReservationValidation,

  // Payment types
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentSummary,

  // Business logic types
  MealPlan,
  MarketSegment,
  DailyOccupancy,
  StayDuration,

  // QR & Ticket system
  QRTicket,

  // Analytics & Reporting
  Report,
  ReportType,
  OccupancyReport,
  RevenueReport,

  // API types
  APIResponse,
  PaginatedResponse,

  // Search & Filtering
  RoomSearchFilters,
  ReservationFilters,

  // Form types
  CreateReservationForm,
  PaymentForm,
} from "./hotel.types";

// Constants
export { HOTEL_CONSTANTS } from "./hotel.types";

// Re-export common types for convenience
export type {
  Tables as DatabaseTables,
  TablesInsert as DatabaseInserts,
  TablesUpdate as DatabaseUpdates,
} from "./database.types";

