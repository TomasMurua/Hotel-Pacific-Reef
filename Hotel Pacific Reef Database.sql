-- Base de Datos Hotel Pacific Reef - Adaptada con Dataset Real
-- PostgreSQL - Versión con datos reales de 36,275 reservas

-- Crear la base de datos
CREATE DATABASE hotel_pacific_reef;

-- Usar la base de datos
\c hotel_pacific_reef;

-- ====================================================================
-- TABLAS PRINCIPALES ADAPTADAS AL DATASET REAL
-- ====================================================================

-- Tabla de Usuarios (mantenemos estructura original del proyecto)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK (role IN ('turista', 'administrador', 'personal', 'dueña')),
    language VARCHAR(5) DEFAULT 'es' CHECK (language IN ('es', 'en')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Habitación (basada en dataset real)
CREATE TABLE room_types (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(20) UNIQUE NOT NULL, -- Room_Type 1, Room_Type 2, etc.
    type_name VARCHAR(50) NOT NULL, -- Nombre descriptivo
    base_price DECIMAL(10,2) NOT NULL, -- Precio base del dataset
    description TEXT,
    pacific_reef_category VARCHAR(20) -- Mapeo a Turista/Premium del proyecto
);

-- Tabla de Habitaciones del Hotel Pacific Reef (38 habitaciones reales)
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type_id INTEGER NOT NULL REFERENCES room_types(id),
    floor INTEGER NOT NULL,
    daily_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    amenities TEXT[], -- Array de equipamiento
    images TEXT[], -- Array de URLs de imágenes
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Planes de Comida (del dataset real)
CREATE TABLE meal_plans (
    id SERIAL PRIMARY KEY,
    plan_code VARCHAR(20) UNIQUE NOT NULL, -- Meal Plan 1, 2, 3, Not Selected
    plan_name VARCHAR(50) NOT NULL,
    description TEXT,
    additional_cost DECIMAL(8,2) DEFAULT 0
);

-- Tabla de Segmentos de Mercado (del dataset real)
CREATE TABLE market_segments (
    id SERIAL PRIMARY KEY,
    segment_code VARCHAR(20) UNIQUE NOT NULL, -- Online, Offline, Corporate, etc.
    segment_name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Tabla de Reservas (estructura híbrida: proyecto + dataset)
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(20) UNIQUE, -- ID estilo dataset (INN00001)
    user_id INTEGER REFERENCES users(id),
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    
    -- Huéspedes (del dataset)
    no_of_adults INTEGER NOT NULL DEFAULT 1,
    no_of_children INTEGER NOT NULL DEFAULT 0,
    
    -- Fechas y duración
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    no_of_weekend_nights INTEGER NOT NULL DEFAULT 0,
    no_of_week_nights INTEGER NOT NULL DEFAULT 0,
    total_days INTEGER NOT NULL,
    
    -- Servicios adicionales
    meal_plan_id INTEGER REFERENCES meal_plans(id),
    required_car_parking_space INTEGER DEFAULT 0,
    no_of_special_requests INTEGER DEFAULT 0,
    
    -- Precios y pagos
    avg_price_per_room DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    reservation_amount DECIMAL(10,2) NOT NULL, -- 30% del total
    
    -- Información de mercado
    market_segment_id INTEGER REFERENCES market_segments(id),
    lead_time INTEGER, -- Días de anticipación de la reserva
    
    -- Estado y metadatos
    status VARCHAR(20) NOT NULL DEFAULT 'Not_Canceled' 
        CHECK (status IN ('Not_Canceled', 'Canceled', 'Check_In', 'Check_Out')),
    repeated_guest INTEGER DEFAULT 0,
    no_of_previous_cancellations INTEGER DEFAULT 0,
    no_of_previous_bookings_not_canceled INTEGER DEFAULT 0,
    
    -- QR y confirmación
    qr_code VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL REFERENCES reservations(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('tarjeta_credito', 'tarjeta_debito', 'transferencia', 'efectivo')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pendiente' 
        CHECK (payment_status IN ('pendiente', 'procesando', 'exitoso', 'fallido')),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Reportes
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ocupacion', 'ingresos', 'clientes', 'cancelaciones')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    data JSONB,
    generated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX idx_reservations_booking_id ON reservations(booking_id);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_room ON reservations(room_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_payments_reservation ON payments(reservation_id);

-- ====================================================================
-- FUNCIONES Y TRIGGERS
-- ====================================================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para generar booking_id automáticamente
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_id IS NULL THEN
        NEW.booking_id = 'PAC' || LPAD(NEW.id::text, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_id_trigger BEFORE INSERT ON reservations
    FOR EACH ROW EXECUTE FUNCTION generate_booking_id();

-- ====================================================================
-- DATOS DE CONFIGURACIÓN (CATÁLOGOS)
-- ====================================================================

-- Insertar tipos de habitación basados en dataset real
INSERT INTO room_types (type_code, type_name, base_price, pacific_reef_category, description) VALUES
('Room_Type 1', 'Habitación Estándar', 95.92, 'Turista', 'Habitación básica con servicios esenciales - Tipo más popular'),
('Room_Type 2', 'Habitación Económica', 87.85, 'Turista', 'Opción económica para huéspedes presupuestarios'),
('Room_Type 3', 'Habitación Simple', 73.68, 'Turista', 'Habitación básica de menor costo'),
('Room_Type 4', 'Habitación Superior', 125.29, 'Premium', 'Habitación mejorada con amenidades adicionales'),
('Room_Type 5', 'Habitación Deluxe', 123.73, 'Premium', 'Habitación de lujo con comodidades premium'),
('Room_Type 6', 'Suite Junior', 182.21, 'Premium', 'Suite con área de estar y servicios exclusivos'),
('Room_Type 7', 'Suite Presidencial', 155.20, 'Premium', 'Suite de máximo lujo con vista panorámica');

-- Insertar planes de comida del dataset
INSERT INTO meal_plans (plan_code, plan_name, description, additional_cost) VALUES
('Not Selected', 'Sin Plan de Comida', 'Solo alojamiento', 0),
('Meal Plan 1', 'Desayuno Incluido', 'Desayuno buffet incluido', 15.00),
('Meal Plan 2', 'Media Pensión', 'Desayuno y cena incluidos', 35.00),
('Meal Plan 3', 'Pensión Completa', 'Desayuno, almuerzo y cena incluidos', 55.00);

-- Insertar segmentos de mercado del dataset
INSERT INTO market_segments (segment_code, segment_name, description) VALUES
('Online', 'Reservas Online', 'Reservas realizadas a través de plataformas digitales'),
('Offline', 'Reservas Presenciales', 'Reservas realizadas directamente en el hotel o por teléfono'),
('Corporate', 'Corporativo', 'Reservas de empresas y viajes de negocios'),
('Aviation', 'Aviación', 'Reservas relacionadas con personal de aviación'),
('Complementary', 'Cortesía', 'Reservas gratuitas o de cortesía');

-- ====================================================================
-- DATOS DE PRUEBA DEL HOTEL PACIFIC REEF
-- ====================================================================

-- Insertar usuarios del proyecto
INSERT INTO users (rut, email, password_hash, first_name, last_name, phone, role) VALUES
('12345678-9', 'george.solo@pacificreef.com', '$2b$10$ejemplo_hash', 'George', 'Solo', '+56912345678', 'administrador'),
('98765432-1', 'martina.blaster@pacificreef.com', '$2b$10$ejemplo_hash', 'Martina', 'Blaster', '+56987654321', 'dueña'),
('11111111-1', 'turista@email.com', '$2b$10$ejemplo_hash', 'Juan', 'Pérez', '+56911111111', 'turista'),
('22222222-2', 'maria.gonzalez@email.com', '$2b$10$ejemplo_hash', 'María', 'González', '+56922222222', 'turista'),
('33333333-3', 'carlos.rodriguez@email.com', '$2b$10$ejemplo_hash', 'Carlos', 'Rodríguez', '+56933333333', 'turista');

-- Insertar las 38 habitaciones del Hotel Pacific Reef con tipos del dataset
-- Pisos 1-5: Habitaciones Turista (30 habitaciones) - usando Room_Type 1, 2, 3
INSERT INTO rooms (room_number, room_type_id, floor, daily_price, description, amenities, images) VALUES
-- Piso 1 - Room_Type 1 (Estándar)
('101', 1, 1, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room101_1.jpg', 'room101_2.jpg', 'room101_3.jpg']),
('102', 1, 1, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room102_1.jpg', 'room102_2.jpg', 'room102_3.jpg']),
('103', 1, 1, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room103_1.jpg', 'room103_2.jpg', 'room103_3.jpg']),
('104', 2, 1, 58000, 'Habitación económica turista', ARRAY['wifi', 'tv', 'baño_privado'], ARRAY['room104_1.jpg', 'room104_2.jpg', 'room104_3.jpg']),
('105', 2, 1, 58000, 'Habitación económica turista', ARRAY['wifi', 'tv', 'baño_privado'], ARRAY['room105_1.jpg', 'room105_2.jpg', 'room105_3.jpg']),
('106', 2, 1, 58000, 'Habitación económica turista', ARRAY['wifi', 'tv', 'baño_privado'], ARRAY['room106_1.jpg', 'room106_2.jpg', 'room106_3.jpg']),

-- Piso 2 - Room_Type 1 y 2
('201', 1, 2, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room201_1.jpg', 'room201_2.jpg', 'room201_3.jpg']),
('202', 1, 2, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room202_1.jpg', 'room202_2.jpg', 'room202_3.jpg']),
('203', 1, 2, 65000, 'Habitación estándar turista', ARRAY['wifi', 'tv', 'aire_acondicionado', 'baño_privado'], ARRAY['room203_1.jpg', 'room203_2.jpg', 'room203_3.jpg']),
('204', 2, 2, 58000, 'Habitación económica turista', ARRAY['wifi', 'tv', 'baño_privado'], ARRAY['room204_1.jpg', 'room204_2.jpg', 'room204_3.jpg']),
('205', 2, 2, 58000, 'Habitación económica turista', ARRAY['wifi', 'tv', 'baño_privado'], ARRAY['room205_1.jpg', 'room205_2.jpg', 'room205_3.jpg']),
('206', 3, 2, 48000, 'Habitación simple turista', ARRAY['wifi', 'tv'], ARRAY['room206_1.jpg', 'room206_2.jpg', 'room206_3.jpg']);

-- Continuar con pisos 3-5 (patrones similares)
-- Pisos 6-7: Habitaciones Premium - usando Room_Type 4, 5, 6, 7
INSERT INTO rooms (room_number, room_type_id, floor, daily_price, description, amenities, images) VALUES
-- Piso 6 - Premium
('601', 4, 6, 85000, 'Habitación superior premium', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'balcon'], ARRAY['room601_1.jpg', 'room601_2.jpg', 'room601_3.jpg']),
('602', 4, 6, 85000, 'Habitación superior premium', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'balcon'], ARRAY['room602_1.jpg', 'room602_2.jpg', 'room602_3.jpg']),
('603', 5, 6, 83000, 'Habitación deluxe premium', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi'], ARRAY['room603_1.jpg', 'room603_2.jpg', 'room603_3.jpg']),
('604', 5, 6, 83000, 'Habitación deluxe premium', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi'], ARRAY['room604_1.jpg', 'room604_2.jpg', 'room604_3.jpg']),

-- Piso 7 - Premium Superior
('701', 6, 7, 125000, 'Suite junior con vista al mar', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi', 'balcon', 'sala_estar'], ARRAY['room701_1.jpg', 'room701_2.jpg', 'room701_3.jpg', 'room701_4.jpg']),
('702', 6, 7, 125000, 'Suite junior con vista al mar', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi', 'balcon', 'sala_estar'], ARRAY['room702_1.jpg', 'room702_2.jpg', 'room702_3.jpg', 'room702_4.jpg']),
('703', 7, 7, 105000, 'Suite presidencial', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi', 'balcon', 'sala_estar', 'comedor'], ARRAY['room703_1.jpg', 'room703_2.jpg', 'room703_3.jpg', 'room703_4.jpg']),
('704', 7, 7, 105000, 'Suite presidencial', ARRAY['wifi', 'smart_tv', 'aire_acondicionado', 'minibar', 'jacuzzi', 'balcon', 'sala_estar', 'comedor'], ARRAY['room704_1.jpg', 'room704_2.jpg', 'room704_3.jpg', 'room704_4.jpg']);

-- ====================================================================
-- RESERVAS DE EJEMPLO CON ESTRUCTURA DEL DATASET
-- ====================================================================

-- Insertar reservas ejemplo siguiendo el patrón del dataset
INSERT INTO reservations (
    user_id, room_id, no_of_adults, no_of_children, 
    check_in_date, check_out_date, no_of_weekend_nights, no_of_week_nights, total_days,
    meal_plan_id, market_segment_id, 
    avg_price_per_room, total_amount, reservation_amount,
    lead_time, status
) VALUES
(3, 1, 2, 0, '2024-09-15', '2024-09-18', 1, 2, 3, 2, 1, 65000, 195000, 58500, 30, 'Not_Canceled'),
(4, 15, 2, 1, '2024-10-01', '2024-10-05', 2, 2, 4, 3, 2, 85000, 340000, 102000, 15, 'Not_Canceled'),
(5, 3, 1, 0, '2024-09-25', '2024-09-27', 2, 0, 2, 1, 1, 65000, 130000, 39000, 45, 'Canceled');

-- ====================================================================
-- CONSULTAS DE TESTING (CRUD ADAPTADO)
-- ====================================================================

-- SELECT: Consultar habitaciones disponibles con información del tipo
SELECT 
    r.room_number, 
    rt.type_name, 
    rt.pacific_reef_category,
    r.daily_price,
    r.floor
FROM rooms r 
JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.active = true 
AND r.id NOT IN (
    SELECT res.room_id 
    FROM reservations res 
    WHERE res.status = 'Not_Canceled'
    AND '2024-09-20' BETWEEN res.check_in_date AND res.check_out_date
);

-- SELECT: Reporte de reservas con datos completos del dataset
SELECT 
    res.booking_id,
    u.first_name || ' ' || u.last_name AS cliente,
    r.room_number,
    rt.type_name,
    res.check_in_date,
    res.check_out_date,
    res.no_of_adults,
    res.no_of_children,
    mp.plan_name,
    ms.segment_name,
    res.avg_price_per_room,
    res.total_amount,
    res.status
FROM reservations res
LEFT JOIN users u ON res.user_id = u.id
JOIN rooms r ON res.room_id = r.id
JOIN room_types rt ON r.room_type_id = rt.id
LEFT JOIN meal_plans mp ON res.meal_plan_id = mp.id
LEFT JOIN market_segments ms ON res.market_segment_id = ms.id
ORDER BY res.created_at DESC
LIMIT 10;

-- INSERT: Crear nueva reserva con estructura completa
-- INSERT INTO reservations (user_id, room_id, no_of_adults, no_of_children, check_in_date, check_out_date, total_days, meal_plan_id, market_segment_id, avg_price_per_room, total_amount, reservation_amount, lead_time)
-- VALUES (3, 5, 2, 1, '2024-11-15', '2024-11-18', 3, 2, 1, 65000, 195000, 58500, 60);

-- UPDATE: Actualizar estado de reserva
-- UPDATE reservations SET status = 'Check_In' WHERE booking_id = 'PAC00001';

-- DELETE: Cancelar reserva
-- UPDATE reservations SET status = 'Canceled' WHERE booking_id = 'PAC00001';