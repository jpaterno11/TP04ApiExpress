import { StatusCodes } from 'http-status-codes';
import alumnosService from '../services/alumnos-service.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

class AlumnosController {
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

    // BEGIN ---------- multer config ----------
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const id = req.params.id;
            const dir = path.join(process.cwd(), 'uploads', 'alumnos', id);
            // Crear carpeta si no existe
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            // conservar extensión original si viene (jpg, png, etc)
            const ext = path.extname(file.originalname) || '.jpg';
            cb(null, 'photo' + ext);
        }
    });

    upload = multer({
        storage: this.storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Solo se permiten archivos de imagen'), false);
            }
            cb(null, true);
        }
    });

    // ---------- NUEVA RUTA: subir foto ----------
    async uploadPhoto(req, res) {
        try {
            const id = req.params.id;

            // (opcional) verificar que el alumno exista antes de guardar
            const alumno = await alumnosService.getAlumnoById(id);
            if (!alumno.success) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send(`No se encontró el alumno (id:${id}).`);
            }

            if (!req.file) {
                return res.status(StatusCodes.BAD_REQUEST)
                    .send('No se recibió el archivo. Usa el campo "image".');
            }

            // Ruta relativa y URL pública (ver sección 3)
            const relativePath = path.join('uploads', 'alumnos', id, req.file.filename);
            const publicUrl = `/static/alumnos/${id}/${req.file.filename}`;

            // Actualizo el Registro
            const result = await alumnosService.updateAlumnoImagen(id, publicUrl);
            if (result.success) {
                res.status(StatusCodes.CREATED).json(result.data);
            } else {
                res.status(StatusCodes.NOT_FOUND).send(`No se encontro la entidad (id:${id}).`);
            }
            
            /*
            return res.status(StatusCodes.CREATED).json({
                id,
                filename: req.file.filename,
                path: relativePath,
                url: publicUrl
            });
            */
        } catch (err) {
            console.error(err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error al subir la imagen.');
        }
    }
}

export default new AlumnosController();
