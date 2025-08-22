import { StatusCodes } from 'http-status-codes';
import cursosService from '../services/cursos-service.js';

class CursosController {
    async getAllCursos(req, res) {
        try {
            const result = await cursosService.getAllCursos();
            
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

    async getCursoById(req, res) {
        try {
            const { id } = req.params;
            
            const result = await cursosService.getCursoById(id);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Curso no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                } else if (result.error === 'ID de curso inválido') {
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

    async createCurso(req, res) {
        try {
            const cursoData = req.body;
            
            const result = await cursosService.createCurso(cursoData);
            
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

    async updateCurso(req, res) {
        try {
            const { id } = req.params;
            const cursoData = req.body;
            
            const result = await cursosService.updateCurso(id, cursoData);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Curso no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                } else if (result.error === 'ID de curso inválido') {
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

    async deleteCurso(req, res) {
        try {
            const { id } = req.params;
            
            const result = await cursosService.deleteCurso(id);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
                    success: true,
                    data: result.data,
                    message: result.message
                });
            } else {
                if (result.error === 'Curso no encontrado') {
                    return res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        error: result.error
                    });
                    });
                } else if (result.error === 'ID de curso inválido') {
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

    async getCursosByDuracion(req, res) {
        try {
            const { minDuracion, maxDuracion } = req.query;
            logHelper.info('Petición GET /cursos/duracion recibida', { minDuracion, maxDuracion });
            
            const result = await cursosService.getCursosByDuracion(minDuracion, maxDuracion);
            
            if (result.success) {
                return res.status(StatusCodes.OK).json({
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
            logHelper.error('Error en controlador al obtener cursos por duración', { minDuracion: req.query.minDuracion, maxDuracion: req.query.maxDuracion, error });
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}

export default new CursosController();
