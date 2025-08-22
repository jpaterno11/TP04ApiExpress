# TP04ApiExpress - API de Alumnos y Cursos

## Descripción
API REST desarrollada en Node.js con Express y PostgreSQL, implementando arquitectura en capas (MVC) con separación de responsabilidades.

## Estructura del Proyecto
```
src/
├── configs/          # Configuraciones (base de datos)
├── controllers/      # Controladores (manejo de peticiones HTTP)
├── services/         # Servicios (lógica de negocio)
├── repositories/     # Repositorios (acceso a datos)
├── entities/         # Entidades del modelo de datos
└── server.js         # Punto de entrada de la aplicación

uploads/              # Archivos subidos (fotos de alumnos)
```

## Características
- ✅ Arquitectura en capas (MVC)
- ✅ Separación de responsabilidades
- ✅ Manejo de errores centralizado
- ✅ Validaciones en servicios
- ✅ Respuestas estandarizadas
- ✅ CORS habilitado
- ✅ Variables de entorno (.env)
- ✅ Subida de imágenes para alumnos

## Endpoints Disponibles

### Alumnos
- `GET /api/alumnos` - Obtener todos los alumnos
- `GET /api/alumnos/:id` - Obtener alumno por ID
- `POST /api/alumnos` - Crear nuevo alumno
- `PUT /api/alumnos/:id` - Actualizar alumno
- `DELETE /api/alumnos/:id` - Eliminar alumno
- `GET /api/alumnos/grupo/:grupoId` - Obtener alumnos por grupo
- `POST /api/alumnos/:id/photo` - Subir foto del alumno

### Cursos
- `GET /api/cursos` - Obtener todos los cursos
- `GET /api/cursos/:id` - Obtener curso por ID
- `POST /api/cursos` - Crear nuevo curso
- `PUT /api/cursos/:id` - Actualizar curso
- `DELETE /api/cursos/:id` - Eliminar curso
- `GET /api/cursos/duracion?minDuracion=X&maxDuracion=Y` - Filtrar cursos por duración

### Utilidades
- `GET /api/health` - Health check de la API

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno (copiar `.env-template` a `.env`)
4. Configurar base de datos PostgreSQL
5. Ejecutar: `npm run server`

## Variables de Entorno (.env)
```env
DB_HOST=localhost
DB_DATABASE=dai-2025
DB_USER=postgres
DB_PASSWORD=root
DB_PORT=5432
PORT=3000
```

## Scripts Disponibles
- `npm run server` - Iniciar servidor en modo desarrollo con nodemon

## Dependencias Principales
- Express 5.1.0 - Framework web
- PostgreSQL (pg) - Cliente de base de datos
- CORS - Middleware para CORS
- Dotenv - Variables de entorno
- Multer - Manejo de archivos
- HTTP Status Codes - Códigos de estado HTTP
- Nodemon - Reinicio automático en desarrollo

## Autor
jpat - Ejercitación Node.js 
