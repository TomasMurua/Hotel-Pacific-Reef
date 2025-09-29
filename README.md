# Hotel Pacific Reef

Sistema de gestión hotelera construido con Next.js 14, Supabase y Elasticsearch.

## 🏨 Descripción

Hotel Pacific Reef es un sistema completo de gestión de reservas hoteleras que incluye:

- 38 habitaciones (30 Turista + 8 Premium)
- Sistema de reservas con dataset real de 36,275 reservas
- Dashboard administrativo completo
- Búsquedas avanzadas con Elasticsearch

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 con App Router
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Búsquedas**: Elasticsearch + Kibana Cloud
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: Strict mode con types generados
- **Despliegue**: Vercel

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone [repository-url]
cd hotel-pacific-reef
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env.local
```

4. Configura las variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Ejecuta el proyecto en desarrollo:

```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js 14 App Router
│   ├── admin/             # Dashboard administrativo
│   ├── booking/           # Sistema de reservas
│   ├── login/             # Autenticación
│   └── rooms/             # Catálogo de habitaciones
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── auth-provider.tsx # Context de autenticación
├── utils/supabase/       # Configuración Supabase
├── types/                # TypeScript definitions
├── lib/                  # Utilidades y servicios
└── data/                 # Datos del hotel (SQL, CSV)
```

## 🔐 Autenticación

El sistema utiliza Supabase Auth con las siguientes credenciales demo:

- **Admin**: admin@hotel.com / 123456
- **Guest**: guest@hotel.com / 123456

## ✨ Características

- ✅ Autenticación completa con Supabase
- ✅ Dashboard administrativo
- ✅ Gestión de reservas
- ✅ Protección de rutas
- ✅ Responsive design
- ✅ TypeScript con types generados
- ✅ Código limpio y documentado

## 🏗️ Desarrollo

Para contribuir al proyecto:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios siguiendo las convenciones del proyecto
3. Ejecuta las pruebas: `npm run build`
4. Crea un Pull Request

## 📊 Datos del Hotel

- **Habitaciones**: 38 total (30 Turista, 8 Premium)
- **Pisos**: 1-5 (Turista), 6-7 (Premium)
- **Reservas**: Dataset real con 36,275 registros
- **Rotación**: 4-6 habitaciones/día
- **Estadía promedio**: 3-12 días

## 🌐 Despliegue

El proyecto está configurado para desplegarse en Vercel:

```bash
npm run build
```

## 📄 Licencia

Este proyecto es privado y pertenece a Hotel Pacific Reef.
