import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Importar controladores
import alumnosController from "./controllers/alumnos-controller.js";
import cursosController from "./controllers/cursos-controller.js";


// Importar helper de logs
import logHelper from "./helpers/log-helper.js";

// Configurar dotenv
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware de logging
app.use((req, res, next) => {
    logHelper.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

// Rutas de Alumnos
app.get('/api/alumnos', alumnosController.getAllAlumnos);
app.get('/api/alumnos/:id', alumnosController.getAlumnoById);
app.post('/api/alumnos', alumnosController.createAlumno);
app.put('/api/alumnos/:id', alumnosController.updateAlumno);
app.delete('/api/alumnos/:id', alumnosController.deleteAlumno);
app.get('/api/alumnos/grupo/:grupoId', alumnosController.getAlumnosByGrupo);
app.post('/api/alumnos/:id/photo', alumnosController.upload.single('image'), alumnosController.uploadPhoto);

// Rutas de Cursos
app.get('/api/cursos', cursosController.getAllCursos);
app.get('/api/cursos/:id', cursosController.getCursoById);
app.post('/api/cursos', cursosController.createCurso);
app.put('/api/cursos/:id', cursosController.updateCurso);
app.delete('/api/cursos/:id', cursosController.deleteCurso);
app.get('/api/cursos/duracion', cursosController.getCursosByDuracion);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    logHelper.error('Error no manejado en la aplicación', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    logHelper.warn('Ruta no encontrada', { method: req.method, url: req.originalUrl });
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`
    });
});

// Iniciar servidor
app.listen(port, () => {
    logHelper.info(`Servidor iniciado exitosamente en puerto ${port}`);
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📚 API de Alumnos y Cursos disponible en http://localhost:${port}/api`);
    console.log(`🔍 Health check en http://localhost:${port}/api/health`);
});

// Manejo de señales de terminación
process.on('SIGINT', () => {
    logHelper.info('Servidor detenido por señal SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logHelper.info('Servidor detenido por señal SIGTERM');
    process.exit(0);
});
