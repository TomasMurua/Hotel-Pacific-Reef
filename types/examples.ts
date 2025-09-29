// Hotel Pacific Reef - Ejemplos de uso de tipos
// Este archivo muestra cómo usar los tipos definidos

import type {
  User,
  Reservation,
  Room,
  CreateReservationForm,
  APIResponse,
  DatabaseTables,
  DatabaseInserts,
  UserRole,
  ReservationStatus,
  PacificReefCategory,
} from "@/types";

// =============================================================================
// EJEMPLOS DE USO DE TIPOS EN COMPONENTES
// =============================================================================

// Ejemplo 1: Función para obtener reservas con tipos completos
export async function getReservationsExample(
  supabase: any // En uso real sería el tipo completo de Supabase client
): Promise<APIResponse<Reservation[]>> {
  try {
    const { data, error } = await supabase.from("reservations").select(`
        *,
        user:users(*),
        room:rooms(
          *,
          room_type:room_types(*)
        ),
        meal_plan:meal_plans(*),
        payments:payments(*)
      `);

    if (error) {
      return {
        data: null,
        error: error.message,
        status: "error",
      };
    }

    return {
      data: data as Reservation[],
      error: null,
      status: "success",
    };
  } catch (err) {
    return {
      data: null,
      error: "Error inesperado al obtener reservas",
      status: "error",
    };
  }
}

// Ejemplo 2: Función para crear una reserva con validación de tipos
export async function createReservationExample(
  formData: CreateReservationForm,
  supabase: any
): Promise<APIResponse<Reservation>> {
  // Calcular lógica de reserva (30% de anticipo)
  const totalAmount = calculateReservationTotal(formData);
  const reservationAmount = totalAmount * 0.3; // 30% de anticipo

  const reservationData: DatabaseInserts<"reservations"> = {
    user_id: formData.user_id,
    room_id: formData.room_id,
    check_in_date: formData.check_in_date,
    check_out_date: formData.check_out_date,
    no_of_adults: formData.no_of_adults,
    no_of_children: formData.no_of_children,
    total_days: calculateDays(formData.check_in_date, formData.check_out_date),
    total_amount: totalAmount,
    reservation_amount: reservationAmount,
    avg_price_per_room:
      totalAmount /
      calculateDays(formData.check_in_date, formData.check_out_date),
    meal_plan_id: formData.meal_plan_id,
    required_car_parking_space: formData.parking_required ? 1 : 0,
    status: "Not_Canceled",
  };

  try {
    const { data, error } = await supabase
      .from("reservations")
      .insert(reservationData)
      .select()
      .single();

    if (error) {
      return {
        data: null,
        error: error.message,
        status: "error",
      };
    }

    return {
      data: data as Reservation,
      error: null,
      status: "success",
    };
  } catch (err) {
    return {
      data: null,
      error: "Error al crear la reserva",
      status: "error",
    };
  }
}

// Ejemplo 3: Filtrar habitaciones disponibles por categoría
export async function getAvailableRoomsExample(
  checkIn: string,
  checkOut: string,
  category: PacificReefCategory,
  supabase: any
): Promise<APIResponse<Room[]>> {
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
        *,
        room_type:room_types!inner(*)
      `
      )
      .eq("active", true)
      .eq("room_type.pacific_reef_category", category)
      .not(
        "id",
        "in",
        // Subquery para excluir habitaciones ocupadas
        supabase
          .from("reservations")
          .select("room_id")
          .eq("status", "Not_Canceled")
          .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`)
      );

    if (error) {
      return {
        data: null,
        error: error.message,
        status: "error",
      };
    }

    return {
      data: data as Room[],
      error: null,
      status: "success",
    };
  } catch (err) {
    return {
      data: null,
      error: "Error al obtener habitaciones disponibles",
      status: "error",
    };
  }
}

// Ejemplo 4: Componente React que usa los tipos
export interface ReservationCardProps {
  reservation: Reservation;
  onCancel: (id: number) => void;
  onCheckIn: (id: number) => void;
}

// Pseudo-código de componente React
/*
export function ReservationCard({ reservation, onCancel, onCheckIn }: ReservationCardProps) {
  const statusColor = getStatusColor(reservation.status);
  const isPaid = reservation.payments?.some(p => p.payment_status === 'exitoso');
  
  return (
    <div className="reservation-card">
      <h3>Reserva #{reservation.booking_id}</h3>
      <p>Estado: <span className={statusColor}>{reservation.status}</span></p>
      <p>Huésped: {reservation.user?.first_name} {reservation.user?.last_name}</p>
      <p>Habitación: {reservation.room?.room_number}</p>
      <p>Check-in: {new Date(reservation.check_in_date).toLocaleDateString()}</p>
      <p>Check-out: {new Date(reservation.check_out_date).toLocaleDateString()}</p>
      <p>Total: ${reservation.total_amount}</p>
      <p>Anticipo (30%): ${reservation.reservation_amount}</p>
      
      {reservation.status === 'Not_Canceled' && (
        <div>
          <button onClick={() => onCancel(reservation.id)}>Cancelar</button>
          <button onClick={() => onCheckIn(reservation.id)}>Check In</button>
        </div>
      )}
    </div>
  );
}
*/

// =============================================================================
// FUNCIONES AUXILIARES
// =============================================================================

function calculateDays(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateReservationTotal(formData: CreateReservationForm): number {
  // Lógica simplificada - en realidad obtendría el precio de la habitación
  const days = calculateDays(formData.check_in_date, formData.check_out_date);
  const baseRate = 100; // Ejemplo: $100/noche
  return days * baseRate;
}

function getStatusColor(status: ReservationStatus): string {
  const colors = {
    Not_Canceled: "text-green-600",
    Canceled: "text-red-600",
    Check_In: "text-blue-600",
    Check_Out: "text-gray-600",
  };
  return colors[status];
}

// =============================================================================
// VALIDACIONES CON TIPOS
// =============================================================================

export function validateUserRole(role: string): role is UserRole {
  const validRoles: UserRole[] = [
    "turista",
    "administrador",
    "personal",
    "dueña",
  ];
  return validRoles.includes(role as UserRole);
}

export function validateReservationStatus(
  status: string
): status is ReservationStatus {
  const validStatuses: ReservationStatus[] = [
    "Not_Canceled",
    "Canceled",
    "Check_In",
    "Check_Out",
  ];
  return validStatuses.includes(status as ReservationStatus);
}

export function validatePacificReefCategory(
  category: string
): category is PacificReefCategory {
  return category === "Turista" || category === "Premium";
}

// Ejemplo de Type Guard personalizado
export function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.email === "string" &&
    typeof obj.first_name === "string" &&
    typeof obj.last_name === "string" &&
    validateUserRole(obj.role)
  );
}

// =============================================================================
// CONSTANTES TIPADAS
// =============================================================================

export const ROOM_AMENITIES = [
  "Wi-Fi gratuito",
  "Aire acondicionado",
  "Vista al mar",
  "Minibar",
  "Caja fuerte",
  "TV por cable",
  "Balcón privado",
  "Baño privado",
  "Servicio a la habitación 24h",
] as const;

export const MEAL_PLAN_OPTIONS = [
  { code: "Meal Plan 1", name: "Solo hospedaje" },
  { code: "Meal Plan 2", name: "Desayuno incluido" },
  { code: "Meal Plan 3", name: "Media pensión" },
  { code: "Not Selected", name: "No seleccionado" },
] as const;

export const MARKET_SEGMENTS = [
  "Online",
  "Offline",
  "Corporate",
  "Complementary",
  "Aviation",
] as const;

