// Generated types for Hotel Pacific Reef Database
// Based on Supabase PostgreSQL schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          rut: string | null;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: "turista" | "administrador" | "personal" | "dueña";
          language: "es" | "en";
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          rut?: string | null;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          role: "turista" | "administrador" | "personal" | "dueña";
          language?: "es" | "en";
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          rut?: string | null;
          email?: string;
          password_hash?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          role?: "turista" | "administrador" | "personal" | "dueña";
          language?: "es" | "en";
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      room_types: {
        Row: {
          id: number;
          type_code: string;
          type_name: string;
          base_price: number;
          description: string | null;
          pacific_reef_category: string | null;
        };
        Insert: {
          id?: number;
          type_code: string;
          type_name: string;
          base_price: number;
          description?: string | null;
          pacific_reef_category?: string | null;
        };
        Update: {
          id?: number;
          type_code?: string;
          type_name?: string;
          base_price?: number;
          description?: string | null;
          pacific_reef_category?: string | null;
        };
      };
      rooms: {
        Row: {
          id: number;
          room_number: string;
          room_type_id: number;
          floor: number;
          daily_price: number;
          description: string | null;
          amenities: string[] | null;
          images: string[] | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          room_number: string;
          room_type_id: number;
          floor: number;
          daily_price: number;
          description?: string | null;
          amenities?: string[] | null;
          images?: string[] | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          room_number?: string;
          room_type_id?: number;
          floor?: number;
          daily_price?: number;
          description?: string | null;
          amenities?: string[] | null;
          images?: string[] | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: number;
          plan_code: string;
          plan_name: string;
          description: string | null;
          additional_cost: number;
        };
        Insert: {
          id?: number;
          plan_code: string;
          plan_name: string;
          description?: string | null;
          additional_cost?: number;
        };
        Update: {
          id?: number;
          plan_code?: string;
          plan_name?: string;
          description?: string | null;
          additional_cost?: number;
        };
      };
      market_segments: {
        Row: {
          id: number;
          segment_code: string;
          segment_name: string;
          description: string | null;
        };
        Insert: {
          id?: number;
          segment_code: string;
          segment_name: string;
          description?: string | null;
        };
        Update: {
          id?: number;
          segment_code?: string;
          segment_name?: string;
          description?: string | null;
        };
      };
      reservations: {
        Row: {
          id: number;
          booking_id: string | null;
          user_id: number | null;
          room_id: number;
          no_of_adults: number;
          no_of_children: number;
          check_in_date: string;
          check_out_date: string;
          no_of_weekend_nights: number;
          no_of_week_nights: number;
          total_days: number;
          meal_plan_id: number | null;
          required_car_parking_space: number;
          no_of_special_requests: number;
          avg_price_per_room: number;
          total_amount: number;
          reservation_amount: number;
          market_segment_id: number | null;
          lead_time: number | null;
          status: "Not_Canceled" | "Canceled" | "Check_In" | "Check_Out";
          repeated_guest: number;
          no_of_previous_cancellations: number;
          no_of_previous_bookings_not_canceled: number;
          qr_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          booking_id?: string | null;
          user_id?: number | null;
          room_id: number;
          no_of_adults?: number;
          no_of_children?: number;
          check_in_date: string;
          check_out_date: string;
          no_of_weekend_nights?: number;
          no_of_week_nights?: number;
          total_days: number;
          meal_plan_id?: number | null;
          required_car_parking_space?: number;
          no_of_special_requests?: number;
          avg_price_per_room: number;
          total_amount: number;
          reservation_amount: number;
          market_segment_id?: number | null;
          lead_time?: number | null;
          status?: "Not_Canceled" | "Canceled" | "Check_In" | "Check_Out";
          repeated_guest?: number;
          no_of_previous_cancellations?: number;
          no_of_previous_bookings_not_canceled?: number;
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          booking_id?: string | null;
          user_id?: number | null;
          room_id?: number;
          no_of_adults?: number;
          no_of_children?: number;
          check_in_date?: string;
          check_out_date?: string;
          no_of_weekend_nights?: number;
          no_of_week_nights?: number;
          total_days?: number;
          meal_plan_id?: number | null;
          required_car_parking_space?: number;
          no_of_special_requests?: number;
          avg_price_per_room?: number;
          total_amount?: number;
          reservation_amount?: number;
          market_segment_id?: number | null;
          lead_time?: number | null;
          status?: "Not_Canceled" | "Canceled" | "Check_In" | "Check_Out";
          repeated_guest?: number;
          no_of_previous_cancellations?: number;
          no_of_previous_bookings_not_canceled?: number;
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: number;
          reservation_id: number;
          amount: number;
          payment_method:
            | "tarjeta_credito"
            | "tarjeta_debito"
            | "transferencia"
            | "efectivo";
          payment_status: "pendiente" | "procesando" | "exitoso" | "fallido";
          transaction_id: string | null;
          payment_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          reservation_id: number;
          amount: number;
          payment_method:
            | "tarjeta_credito"
            | "tarjeta_debito"
            | "transferencia"
            | "efectivo";
          payment_status?: "pendiente" | "procesando" | "exitoso" | "fallido";
          transaction_id?: string | null;
          payment_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          reservation_id?: number;
          amount?: number;
          payment_method?:
            | "tarjeta_credito"
            | "tarjeta_debito"
            | "transferencia"
            | "efectivo";
          payment_status?: "pendiente" | "procesando" | "exitoso" | "fallido";
          transaction_id?: string | null;
          payment_date?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: number;
          type: "ocupacion" | "ingresos" | "clientes" | "cancelaciones";
          start_date: string;
          end_date: string;
          data: Json | null;
          generated_by: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          type: "ocupacion" | "ingresos" | "clientes" | "cancelaciones";
          start_date: string;
          end_date: string;
          data?: Json | null;
          generated_by?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          type?: "ocupacion" | "ingresos" | "clientes" | "cancelaciones";
          start_date?: string;
          end_date?: string;
          data?: Json | null;
          generated_by?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "turista" | "administrador" | "personal" | "dueña";
      user_language: "es" | "en";
      reservation_status:
        | "Not_Canceled"
        | "Canceled"
        | "Check_In"
        | "Check_Out";
      payment_method:
        | "tarjeta_credito"
        | "tarjeta_debito"
        | "transferencia"
        | "efectivo";
      payment_status: "pendiente" | "procesando" | "exitoso" | "fallido";
      report_type: "ocupacion" | "ingresos" | "clientes" | "cancelaciones";
      pacific_reef_category: "Turista" | "Premium";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Type helpers
export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;

