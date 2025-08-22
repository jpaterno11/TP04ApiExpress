import cursosRepository from '../repositories/cursos-repository.js';

class CursosService {
    async getAllCursos() {
        try {
            const cursos = await cursosRepository.getAll();
            return {
                success: true,
                data: cursos,
                message: 'Cursos obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async getCursoById(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de curso inválido'
                };
            }

            const curso = await cursosRepository.getById(parseInt(id));
            
            if (!curso) {
                return {
                    success: false,
                    error: 'Curso no encontrado'
                };
            }

            return {
                success: true,
                data: curso,
                message: 'Curso obtenido exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async createCurso(cursoData) {
        try {
            // Validaciones básicas
            const { nombre, descripcion, duracion, precio } = cursoData;
            
            if (!nombre) {
                return {
                    success: false,
                    error: 'Nombre del curso es obligatorio'
                };
            }

            if (duracion && (isNaN(duracion) || duracion <= 0)) {
                return {
                    success: false,
                    error: 'Duración debe ser un número positivo'
                };
            }

            if (precio && (isNaN(precio) || precio < 0)) {
                return {
                    success: false,
                    error: 'Precio debe ser un número no negativo'
                };
            }

            const nuevoCurso = await cursosRepository.create(cursoData);
            
            return {
                success: true,
                data: nuevoCurso,
                message: 'Curso creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async updateCurso(id, cursoData) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de curso inválido'
                };
            }

            const cursoExistente = await cursosRepository.getById(parseInt(id));
            if (!cursoExistente) {
                return {
                    success: false,
                    error: 'Curso no encontrado'
                };
            }

            const cursoActualizado = await cursosRepository.update(parseInt(id), cursoData);
            
            return {
                success: true,
                data: cursoActualizado,
                message: 'Curso actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async deleteCurso(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de curso inválido'
                };
            }

            const cursoEliminado = await cursosRepository.delete(parseInt(id));
            
            if (!cursoEliminado) {
                return {
                    success: false,
                    error: 'Curso no encontrado'
                };
            }

            return {
                success: true,
                data: cursoEliminado,
                message: 'Curso eliminado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async getCursosByDuracion(minDuracion, maxDuracion) {
        try {
            if (!minDuracion || !maxDuracion || 
                isNaN(parseInt(minDuracion)) || isNaN(parseInt(maxDuracion))) {
                return {
                    success: false,
                    error: 'Duración mínima y máxima deben ser números válidos'
                };
            }

            if (parseInt(minDuracion) > parseInt(maxDuracion)) {
                return {
                    success: false,
                    error: 'Duración mínima no puede ser mayor que la máxima'
                };
            }

            const cursos = await cursosRepository.getByDuracion(
                parseInt(minDuracion), 
                parseInt(maxDuracion)
            );
            
            return {
                success: true,
                data: cursos,
                message: 'Cursos filtrados por duración obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }
}

export default new CursosService();
