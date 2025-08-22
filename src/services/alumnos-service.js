import alumnosRepository from '../repositories/alumnos-repository.js';

class AlumnosService {
    async getAllAlumnos() {
        try {
            const alumnos = await alumnosRepository.getAll();
            return {
                success: true,
                data: alumnos,
                message: 'Alumnos obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async getAlumnoById(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de alumno inválido'
                };
            }

            const alumno = await alumnosRepository.getById(parseInt(id));
            
            if (!alumno) {
                return {
                    success: false,
                    error: 'Alumno no encontrado'
                };
            }

            return {
                success: true,
                data: alumno,
                message: 'Alumno obtenido exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async createAlumno(alumnoData) {
        try {
            // Validaciones básicas
            const { nombre, apellido, email, edad, grupo_id, imagen } = alumnoData;
            
            if (!nombre || !apellido || !email) {
                return {
                    success: false,
                    error: 'Nombre, apellido y email son obligatorios'
                };
            }

            if (edad && (isNaN(edad) || edad < 0 || edad > 120)) {
                return {
                    success: false,
                    error: 'Edad debe ser un número válido entre 0 y 120'
                };
            }

            if (grupo_id && isNaN(parseInt(grupo_id))) {
                return {
                    success: false,
                    error: 'ID de grupo debe ser un número válido'
                };
            }

            const nuevoAlumno = await alumnosRepository.create(alumnoData);
            
            return {
                success: true,
                data: nuevoAlumno,
                message: 'Alumno creado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async updateAlumno(id, alumnoData) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de alumno inválido'
                };
            }

            const alumnoExistente = await alumnosRepository.getById(parseInt(id));
            if (!alumnoExistente) {
                return {
                    success: false,
                    error: 'Alumno no encontrado'
                };
            }

            const alumnoActualizado = await alumnosRepository.update(parseInt(id), alumnoData);
            
            return {
                success: true,
                data: alumnoActualizado,
                message: 'Alumno actualizado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async deleteAlumno(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de alumno inválido'
                };
            }

            const alumnoEliminado = await alumnosRepository.delete(parseInt(id));
            
            if (!alumnoEliminado) {
                return {
                    success: false,
                    error: 'Alumno no encontrado'
                };
            }

            return {
                success: true,
                data: alumnoEliminado,
                message: 'Alumno eliminado exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async getAlumnosByGrupo(grupoId) {
        try {
            if (!grupoId || isNaN(parseInt(grupoId))) {
                return {
                    success: false,
                    error: 'ID de grupo inválido'
                };
            }

            const alumnos = await alumnosRepository.getByGrupo(parseInt(grupoId));
            
            return {
                success: true,
                data: alumnos,
                message: 'Alumnos del grupo obtenidos exitosamente'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error interno del servidor',
                details: error.message
            };
        }
    }

    async updateAlumnoImagen(id, imagenUrl) {
        try {
            if (!id || isNaN(parseInt(id))) {
                return {
                    success: false,
                    error: 'ID de alumno inválido'
                };
            }

            const alumnoExistente = await alumnosRepository.getById(parseInt(id));
            if (!alumnoExistente) {
                return {
                    success: false,
                    error: 'Alumno no encontrado'
                };
            }

            const alumnoActualizado = await alumnosRepository.update(parseInt(id), { imagen: imagenUrl });
            
            return {
                success: true,
                data: alumnoActualizado,
                message: 'Imagen del alumno actualizada exitosamente'
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

export default new AlumnosService();
