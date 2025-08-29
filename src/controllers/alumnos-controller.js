import { StatusCodes } from 'http-status-codes';
import alumnosService from '../services/alumnos-service.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

class AlumnosController {
    constructor() {
        // Configuración de multer para subida de imágenes
        this.upload = multer({
            storage: multer.memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
            fileFilter: (req, file, cb) => {
                if (!file.mimetype?.startsWith('image/')) {
                    return cb(new Error('Solo se permiten archivos de imagenes.'), false);
                }
                cb(null, true);
            }
        });
    }

    // =========================
    // HELPERS PARA MANEJO DE IMÁGENES
    // =========================

    /**
     * Sanitiza el nombre del archivo para evitar paths raros y caracteres problemáticos
     */
    sanitizeFilename(name = '') {
        const base = path.basename(name);
        return base.replace(/[^a-zA-Z0-9._-]/g, '_');
    }

    /**
     * Obtiene la extensión del archivo basándose en el nombre o mimetype
     */
    getExtFrom(file) {
        const extFromName = path.extname(file?.originalname || '').toLowerCase();
        if (extFromName) return extFromName;
        
        const map = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp',
            'image/gif': '.gif',
            'image/heic': '.heic',
            'image/heif': '.heif'
        };
        return map[file?.mimetype] || '.jpg';
    }

    /**
     * Padea el ID con ceros a la izquierda
     */
    padId(id, width = 6) {
        const num = Number(id);
        return (Number.isInteger(num) && num >= 0)
            ? String(num).padStart(width, '0')
            : String(id).padStart(width, '0');
    }

    /**
     * Genera un timestamp en formato YYYYMMDDHHmmssSSS
     */
    nowTimestamp(d = new Date()) {
        const yyyy = d.getFullYear();
        const MM = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const HH = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        const ss = String(d.getSeconds()).padStart(2, '0');
        const SSS = String(d.getMilliseconds()).padStart(3, '0');
        return `${yyyy}${MM}${dd}${HH}${mm}${ss}${SSS}`;
    }

    /**
     * Genera un nombre único para el archivo de imagen
     */
    generateUniqueFilename(id, originalName) {
        const ext = this.getExtFrom({ originalname: originalName });
        const original = this.sanitizeFilename(originalName || `photo${ext}`);
        const paddedId = this.padId(id);
        const timestamp = this.nowTimestamp();
        
        return `${paddedId}-${timestamp}-${original}`;
    }

    /**
     * Guarda una imagen en el sistema de archivos
     */
    async saveImageToFileSystem(fileBuffer, filename, subfolder) {
        const dir = path.join(process.cwd(), 'uploads', subfolder);
        const finalPath = path.join(dir, filename);
        
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(finalPath, fileBuffer);
        
        return finalPath;
    }

    /**
     * Elimina un archivo del sistema de archivos
     */
    async deleteImageFromFileSystem(filePath) {
        await fs.rm(filePath, { force: true });
    }

    /**
     * Genera la URL pública para una imagen
     */
    generatePublicUrl(filename, subfolder) {
        return `/static/${subfolder}/${filename}`;
    }

    // =========================
    // MÉTODOS DEL CONTROLADOR
    // =========================

    async getAllAlumnos(req, res) {
        try {
            const result = await alumnosService.getAllAlumnos();
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    async getAlumnoById(req, res) {
        try {
            const { id } = req.params;
            
            const result = await alumnosService.getAlumnoById(id);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Alumno no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                } else if (result.error === 'ID de alumno inválido') {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        error: result.error
                    });
                } else {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: result.error
                    });
                }
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    async createAlumno(req, res) {
        try {
            const alumnoData = req.body;
            
            const result = await alumnosService.createAlumno(alumnoData);
            
            if (result.success) {
                return res.status(StatusCodes.CREATED).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    async updateAlumno(req, res) {
        try {
            const { id } = req.params;
            const alumnoData = req.body;
            
            const result = await alumnosService.updateAlumno(id, alumnoData);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Alumno no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                } else if (result.error === 'ID de alumno inválido') {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        error: result.error
                    });
                } else {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: result.error
                    });
                }
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    async deleteAlumno(req, res) {
        try {
            const { id } = req.params;
            
            const result = await alumnosService.deleteAlumno(id);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Alumno no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                } else if (result.error === 'ID de alumno inválido') {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        error: result.error
                    });
                } else {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: result.error
                    });
                }
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    async getAlumnosByGrupo(req, res) {
        try {
            const { grupoId } = req.params;
            
            const result = await alumnosService.getAlumnosByGrupo(grupoId);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'ID de grupo inválido') {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        success: false,
                        error: result.error
                    });
                } else {
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        error: result.error
                    });
                }
            }
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // ---------- NUEVA RUTA: subir foto ----------
    async uploadPhoto(req, res) {
        const id = req.params.id;

        try {
            // 1) Verificar que exista el alumno
            const alumno = await alumnosService.getAlumnoById(id);
            if (!alumno.success) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send(`No se encontró el alumno (id:${id}).`);
            }

            // 2) Validar archivo
            if (!req.file) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send('No se recibió el archivo. Usa el campo "image".');
            }

            // 3) Armar nombre único usando el helper
            const uniqueName = this.generateUniqueFilename(id, req.file.originalname);

            // 4) Guardar en filesystem usando el helper
            const finalPath = await this.saveImageToFileSystem(req.file.buffer, uniqueName, 'alumnos');

            // 5) URL pública y actualización en DB
            const publicUrl = this.generatePublicUrl(uniqueName, 'alumnos');
            
            // Actualizo el Registro
            const result = await alumnosService.updateAlumnoImagen(id, publicUrl);
            if (result.success) {
                return res.status(StatusCodes.CREATED).json({
                    id,
                    filename: uniqueName,
                    url: publicUrl
                });
            } else {
                // Si no se pudo actualizar la DB, limpiar el archivo creado
                await this.deleteImageFromFileSystem(finalPath);
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send(`No se pudo actualizar el alumno (id:${id}).`);
            }
        } catch (err) {
            console.error(err);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('Error al subir la imagen.');
        }
    }
}

export default new AlumnosController();
