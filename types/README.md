# Hotel Pacific Reef - TypeScript Types

Este directorio contiene todas las definiciones de tipos TypeScript para el proyecto Hotel Pacific Reef, optimizadas para Next.js 14 + Supabase + Elasticsearch.

## 📁 Estructura de Archivos

```
types/
├── database.types.ts    # Tipos generados de Supabase
├── hotel.types.ts       # Interfaces de negocio del hotel
├── index.ts            # Exportaciones centralizadas
├── examples.ts         # Ejemplos de uso
└── README.md           # Esta documentación
```

## 🚀 Uso Rápido

### Importación Simple

```typescript
import type { User, Reservation, Room, APIResponse } from "@/types";
```

### Importación de Tipos de Base de Datos

```typescript
import type { Database, Tables, TablesInsert } from "@/types";
```

### Cliente Supabase Tipado

```typescript
import { createClient } from "@/utils/supabase/client";

const supabase = createClient(); // Ya incluye tipos Database
```

## 🏨 Tipos Específicos del Hotel

### **User Types** - Roles del Hotel Pacific Reef

- `Tourist` - Huéspedes del hotel
- `Administrator` - Administradores del sistema
- `Staff` - Personal del hotel (recepción, limpieza, etc.)
- `Owner` - Propietaria del hotel

### **Room Types** - 38 Habitaciones

- `TuristaRoom` - 30 habitaciones (pisos 1-5)
- `PremiumRoom` - 8 habitaciones (pisos 6-7)
- Mapeo automático de `Room_Type 1-7` a categorías

### **Reservation Types** - Lógica de Reservas

- Anticipo obligatorio del 30%
- Estados: `Not_Canceled`, `Canceled`, `Check_In`, `Check_Out`
- Estadías típicas: 3-12 días
- Rotación: 4-6 habitaciones/día

### **Payment Types** - Sistema de Pagos

- Métodos: tarjeta_credito, tarjeta_debito, transferencia, efectivo
- Estados: pendiente, procesando, exitoso, fallido
- Cálculo automático de montos pendientes

## 💡 Ejemplos de Uso

### 1. Crear una Reserva

```typescript
import type { CreateReservationForm, APIResponse, Reservation } from "@/types";

const createReservation = async (
  data: CreateReservationForm
): Promise<APIResponse<Reservation>> => {
  // Cálculo automático del 30% de anticipo
  const totalAmount = calculateTotal(data);
  const reservationAmount = totalAmount * 0.3;

  // Tu lógica aquí...
};
```

### 2. Filtrar Habitaciones por Categoría

```typescript
import type { Room, PacificReefCategory } from "@/types";

const getAvailableRooms = async (
  category: PacificReefCategory, // "Turista" | "Premium"
  checkIn: string,
  checkOut: string
): Promise<Room[]> => {
  // Tu lógica aquí...
};
```

### 3. Validar Usuarios

```typescript
import type { User, UserRole } from "@/types";

const validateUser = (userData: any): userData is User => {
  return userData.role in ["turista", "administrador", "personal", "dueña"];
};
```

## 🔧 Generar Tipos de Supabase

Para actualizar los tipos desde tu base de datos de Supabase:

```bash
# Requiere login en Supabase CLI
supabase login

# Generar tipos actualizados
npx supabase gen types typescript --project-id hhcwlqjnnghrjkirixak > types/database.types.ts
```

## 📊 Constantes del Negocio

### HOTEL_CONSTANTS

```typescript
import { HOTEL_CONSTANTS } from "@/types";

HOTEL_CONSTANTS.TOTAL_ROOMS; // 38
HOTEL_CONSTANTS.TURISTA_ROOMS; // 30
HOTEL_CONSTANTS.PREMIUM_ROOMS; // 8
HOTEL_CONSTANTS.DEPOSIT_PERCENTAGE; // 0.3 (30%)
HOTEL_CONSTANTS.ROOM_TYPE_MAPPING; // { 1: "Turista", 5: "Premium", ... }
```

## 🌐 Soporte Multiidioma

Tipos incluyen soporte para:

- `es` (español) - idioma por defecto
- `en` (inglés)

```typescript
import type { UserLanguage } from "@/types";

const language: UserLanguage = "es"; // o "en"
```

## ✅ Type Guards Incluidos

```typescript
import {
  validateUserRole,
  validateReservationStatus,
  isUser,
} from "@/types/examples";

// Validar rol de usuario
if (validateUserRole(userInput)) {
  // userInput es ahora UserRole tipado
}

// Validar objeto completo de usuario
if (isUser(userData)) {
  // userData es ahora User tipado
}
```

## 🔍 Elasticsearch Integration

Los tipos están preparados para integración con Elasticsearch:

```typescript
// Los índices recomendados en Elasticsearch:
// - hotel_rooms (habitaciones)
// - reservations (reservas)
// - availability (disponibilidad)
```

## 🚨 Reglas Importantes

1. **NUNCA usar `any`** - Todos los tipos están definidos
2. **Siempre importar desde `@/types`** - Punto central de importación
3. **Validar entrada de usuario** - Usar type guards provided
4. **Respetar lógica de negocio** - 30% anticipo, categorías Room_Type, etc.

## 🔄 Actualizaciones

Este sistema de tipos se actualiza automáticamente con:

- Cambios en el schema de Supabase
- Nuevas reglas de negocio del hotel
- Optimizaciones de performance

Para mantener sincronizados, ejecuta regularmente el comando de generación de tipos de Supabase.
